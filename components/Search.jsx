import { Center, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";

const Search = ({
  setSearchTerm,
  searchTerm,
  handleSearch,
  placeholder = "Search...",
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const inputWidth = isSmallScreen ? "100%" : "420px";

  return (
    <Center style={{ width: "100%", paddingInline: isSmallScreen ? "1rem" : 0 }}>
      <TextInput
        style={{ width: inputWidth, maxWidth: "100%" }}
        value={searchTerm}
        rightSection={
          searchTerm !== "" && (
            <IconX
              onClick={() => setSearchTerm("")}
              size={16}
              style={{ cursor: "pointer" }}
            />
          )
        }
        onChange={handleSearch}
        type="search"
        placeholder={placeholder}
        radius="xl"
        size="md"
        styles={{
          input: {
            borderWidth: 1,
          },
        }}
      />
    </Center>
  );
};

export default Search;
