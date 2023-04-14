import { Center, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";

const Search = ({ setSearchTerm, searchTerm, handleSearch }) => {
    const matches = useMediaQuery(theme => theme.breakpoints.down("sm"));
  
    return (
      <Center>
        <TextInput
          sx={{ width: matches ? "25vh" : "50vh" }}
          value={searchTerm}
          rightSection={
            searchTerm !== "" && (
              <IconX onClick={() => setSearchTerm("")} size="xs" />
            )
          }
          onChange={handleSearch}
          type="search"
          placeholder="Search..."
        />
      </Center>
    );
  };

  export default Search