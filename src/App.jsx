import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Slider from '@mui/material/Slider';

function App() {
  const [funFact, setfunFact] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const searchDogFunFact = () => {
    fetch(`https://dogapi.dog/api/v1/facts?number=2`)
      .then(response => response.json())
      .then(data => {
        setDataArray(data.facts)
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <TextField
        id="outlined-controlled"
        label="Search"
        value={funFact}
        onChange={(event) => setfunFact(event.target.value)}
      />
      <Button onClick={searchDogFunFact}>Search</Button>

      {dataArray.map((fact, index) => (<div key = {index}>{fact}</div>
      ))}
    </>
  );
}

export default App;