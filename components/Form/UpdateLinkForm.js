import { useState } from 'react';
import { useForm } from 'react-hook-form';

function UpdateLinkForm({links}) {
  const [getLinks, setLinks] = useState({
    spotify: '',
    bandcamp: '',
    appleMusic: '',
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    setLinks(data);
  };

  const renderField = (label, name) => {
    if (links[name]) {
      return null;
    }

    return (
      <div>
        <label htmlFor={name}>{label}:</label>
        <input type="text" id={name} name={name} {...register({ name })} />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderField('Spotify', 'spotify')}
      {renderField('Bandcamp', 'bandcamp')}
      {renderField('Apple Music', 'appleMusic')}
      <input type="submit" />
    </form>
  );
}
