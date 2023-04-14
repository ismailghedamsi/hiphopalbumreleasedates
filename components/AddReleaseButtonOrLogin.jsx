import { useContext } from "react";
import { AddReleaseButton, LoginToUploadButton } from "./styled/ReleaseGrid/Buttons";
import AppContext from "./AppContext";

const AddReleaseButtonOrLogin = ({ onAddRelease, onLogin }) => {
    const { loggedUser } = useContext(AppContext)
    if (loggedUser) {
      return (
        <AddReleaseButton onClick={onAddRelease}>
          Add release
        </AddReleaseButton>
      );
    } else {
      return (
        <LoginToUploadButton onClick={onLogin}>
          Login to add a release
        </LoginToUploadButton>
      );
    }
  };

  export default AddReleaseButtonOrLogin