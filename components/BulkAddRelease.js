import { useContext, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from "./AppContext";
import { trim } from "lodash";
import { Textarea } from "@mantine/core";
import DateHelpers from "../helper/dateUtilities";

const JSON_EXAMPLE = `[
  {
    "artist": "Artist Name",
    "album": "Album Name",
    "releaseDate": "2024-12-25",
    "cover": "https://example.com/cover.jpg",
    "spotify": "https://open.spotify.com/album/...",
    "bandcamp": "https://artist.bandcamp.com/album/...",
    "apple_music": "https://music.apple.com/album/..."
  },
  {
    "artist": "Another Artist",
    "album": "Another Album",
    "releaseDate": "2024-12-31",
    "cover": "",
    "spotify": "",
    "bandcamp": "",
    "apple_music": ""
  }
]`;

export default function BulkAddRelease({ setAdditionId, setInsertedData, setSelectedIndex, setSelectedYear }) {
  const [jsonInput, setJsonInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { loggedUser, setYear, setMonth } = useContext(AppContext);

  const showError = (message) => toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const showSuccess = (message) => toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER
  });
  const showInfo = (message) => toast.info(message, {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const validateAlbum = (album, index) => {
    if (!album.artist || typeof album.artist !== 'string' || trim(album.artist).length < 2) {
      throw new Error(`Album at index ${index}: Artist name is required and must be at least 2 characters`);
    }
    if (!album.album || typeof album.album !== 'string' || trim(album.album).length < 2) {
      throw new Error(`Album at index ${index}: Album name is required and must be at least 2 characters`);
    }
    if (!album.releaseDate || typeof album.releaseDate !== 'string') {
      throw new Error(`Album at index ${index}: Release date is required (format: YYYY-MM-DD)`);
    }
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(album.releaseDate)) {
      throw new Error(`Album at index ${index}: Release date must be in YYYY-MM-DD format`);
    }
    // Validate date is valid
    const date = dayjs(album.releaseDate);
    if (!date.isValid()) {
      throw new Error(`Album at index ${index}: Invalid release date`);
    }
    return true;
  };

  const processBulkAdd = async () => {
    if (!jsonInput.trim()) {
      showError("Please enter JSON data");
      return;
    }

    // Check if user is logged in
    if (!loggedUser || !loggedUser.id) {
      showError("You must be logged in to add albums. Please sign in first.");
      setIsProcessing(false);
      return;
    }

    // Get the current authenticated user from Supabase session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      showError("Authentication error: Please try logging out and logging back in.");
      setIsProcessing(false);
      return;
    }

    // Use the authenticated user's ID from the session
    const userId = authUser.id;
    
    console.log("Using user ID:", userId);
    console.log("Logged user from context:", loggedUser);
    console.log("Auth user:", authUser);

    // Check if user exists in the profiles table (the foreign key references profiles)
    try {
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      console.log("Profile check result:", profileCheck, profileCheckError);
      
      // If profile doesn't exist, try to create it
      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        console.log("Profile not found, attempting to create...");
        // Try minimal insert with just id first, then try with additional fields
        let profileData = { id: userId };
        
        // Try to add username if it exists in the schema
        const username = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user';
        profileData.username = username;
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (createError) {
          // If that fails, try with just the id
          console.warn("First insert attempt failed, trying with just id:", createError);
          const { data: newProfile2, error: createError2 } = await supabase
            .from('profiles')
            .insert({ id: userId })
            .select()
            .single();
          
          if (createError2) {
            console.warn("Could not create profile record:", createError2);
            showError(`Profile creation failed: ${createError2.message}. Please run the SQL script in Supabase to create your profile.`);
            setIsProcessing(false);
            return;
          } else {
            console.log("Profile created successfully with just id:", newProfile2);
          }
        } else {
          console.log("Profile created successfully:", newProfile);
        }
      } else if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.warn("Profiles table error:", profileCheckError);
      }
    } catch (e) {
      console.warn("Could not check profiles table:", e);
    }

    setIsProcessing(true);

    try {
      // Parse JSON
      let albums;
      try {
        albums = JSON.parse(jsonInput);
      } catch (parseError) {
        showError(`Invalid JSON format: ${parseError.message}`);
        setIsProcessing(false);
        return;
      }

      // Validate it's an array
      if (!Array.isArray(albums)) {
        showError("JSON must be an array of album objects");
        setIsProcessing(false);
        return;
      }

      if (albums.length === 0) {
        showError("JSON array is empty");
        setIsProcessing(false);
        return;
      }

      const releasesToInsert = [];
      const skippedReleases = [];

      albums.forEach((album, index) => {
        try {
          validateAlbum(album, index);
        } catch (validationError) {
          if (validationError.message?.includes("Artist name is required") && typeof album.artist === "string" && album.artist.trim().length < 2) {
            skippedReleases.push({ index, album, reason: "Artist name shorter than 2 characters" });
            return;
          }
          skippedReleases.push({ index, album, reason: validationError.message || "Validation error" });
          return;
        }

        const release = {
          artist: trim(album.artist),
          album: trim(album.album),
          releaseDate: dayjs(album.releaseDate).format('YYYY-MM-DD'),
          cover: album.cover || "",
          links: {
            spotify: album.spotify || "",
            bandcamp: album.bandcamp || "",
            apple_music: album.apple_music || ""
          },
          addedBy: userId
        };
        releasesToInsert.push(release);
      });

      const insertedReleases = [];
      const duplicateReleases = [];
      const failedReleases = [];

      for (let i = 0; i < releasesToInsert.length; i++) {
        const release = releasesToInsert[i];
        const { data, error } = await supabase
          .from("releases")
          .insert(release)
          .select('*')
          .single();

        if (error) {
          console.error("Database error:", error);
          if (error.code === '23505') {
            duplicateReleases.push({ index: i, release });
          } else if (error.code === '23503' || error.message.includes('foreign key constraint')) {
            const tableName = error.details?.match(/table "(\w+)"/)?.[1] || 'profiles';
            const userID = error.details?.match(/Key \(addedBy\)=\(([^)]+)\)/)?.[1] || userId;
            const errorMsg = error.details || error.message;
            console.error("Foreign key error:", errorMsg);
            failedReleases.push({ index: i, release, message: `User account (${userID}) doesn't exist in the "${tableName}" table. ${errorMsg}` });
          } else {
            failedReleases.push({ index: i, release, message: error.message });
          }
        } else if (data) {
          insertedReleases.push(data);
        }
      }

      if (insertedReleases.length > 0) {
        const firstRelease = insertedReleases[0];
        var releaseDate = new Date(firstRelease.releaseDate);
        releaseDate = new Date(releaseDate.setHours(releaseDate.getHours() + 24));
        const m = DateHelpers.getMonth(releaseDate);
        setMonth(m);
        setYear(releaseDate.getFullYear());

        setInsertedData(insertedReleases);
        setAdditionId(Date.now()); // Use timestamp as unique ID
        setJsonInput("");
        showSuccess(`Successfully added ${insertedReleases.length} album(s)!`);
      }

      if (duplicateReleases.length > 0) {
        showInfo(`${duplicateReleases.length} album(s) were skipped because they already exist.`);
      }

      if (skippedReleases.length > 0) {
        const shortArtistSkips = skippedReleases.filter((skip) => skip.reason === "Artist name shorter than 2 characters");
        const otherSkips = skippedReleases.filter((skip) => skip.reason !== "Artist name shorter than 2 characters");

        if (shortArtistSkips.length > 0) {
          showInfo(`${shortArtistSkips.length} album(s) were ignored because the artist name had fewer than 2 characters.`);
        }

        if (otherSkips.length > 0) {
          const uniqueSkipMessages = [...new Set(otherSkips.map((skip) => skip.reason))];
          showInfo(`${otherSkips.length} album(s) were skipped due to validation: ${uniqueSkipMessages.join('; ')}`);
        }
      }

      if (failedReleases.length > 0) {
        const uniqueMessages = [...new Set(failedReleases.map((f) => f.message || "Unknown error"))];
        showError(`Failed to add ${failedReleases.length} album(s): ${uniqueMessages.join("; ")}`);
      }

      if (
        insertedReleases.length === 0 &&
        duplicateReleases.length === 0 &&
        failedReleases.length === 0 &&
        skippedReleases.length === 0
      ) {
        showError("No albums were added. Please check your data.");
      }
    } catch (error) {
      showError(error.message || "An error occurred while processing the albums");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON_EXAMPLE);
  };

  return (
    <div style={{ marginLeft: "5px", paddingLeft: "10px" }}>
      <div className="field">
        <label className="label">JSON Albums Data</label>
        <div className="control">
          <Textarea
            placeholder="Paste your JSON array of albums here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            minRows={10}
            maxRows={15}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </div>
        <p className="help" style={{ marginTop: "10px", marginBottom: "10px", fontSize: "0.9em" }}>
          <strong>Required fields:</strong> artist, album, releaseDate (YYYY-MM-DD format)<br/>
          <strong>Optional fields:</strong> cover (URL), spotify, bandcamp, apple_music (all URL strings)
        </p>
        <button
          type="button"
          className="button is-light is-small"
          onClick={loadExample}
          style={{ marginBottom: "10px" }}
        >
          Load Example
        </button>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            disabled={isProcessing}
            type="button"
            onClick={processBulkAdd}
            className="button is-link"
          >
            {isProcessing ? "Processing..." : "Add Albums"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

