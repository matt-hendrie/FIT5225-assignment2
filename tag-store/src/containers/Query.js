import React from 'react';
import { Typography, Box, Button, TextField, TextareaAutosize } from '@material-ui/core';
import { flexbox, positions, spacing } from '@material-ui/system';
import { useHistory } from 'react-router-dom'
import { Auth, input } from 'aws-amplify';
import axios from 'axios'
import Qs from 'qs'

export default function Query() {
  const history = useHistory()

  let params = []
  let tagArray = []

  function handleBackClick(e) {
    history.push("/Navigation")
  }

  function handleTextChange(e) {
    tagArray = e.target.value.split(",")
    if (tagArray.length > 10) {
      alert("Only 10 tags allowed")
    }
    // console.log(tagArray)
    return tagArray
  }

  async function generateTags() {
    if (tagArray.length == 0) {
      alert("Must have at least one tag")
    } else {
      var count = 1
      tagArray.forEach(element => {
        let tag = "tag" + count
        let param = { [tag]: element }
        params.push(param)
        count++
        // console.log(params)
      })

      const idToken = await (await Auth.currentSession()).getIdToken()
      console.log("idToken: ", idToken)

      // parseParams
      let options = ''
      params.forEach(param => {
        const key = Object.keys(param)[0]
        const value = Object.values(param)[0]
        options += `${key}=${value}&`
      })

      // reset arrays and values
      params = []
      tagArray = []
      document.getElementById("tags").value = ""
      options = options.slice(0, -1)
      console.log(options)

      // construct URL
      const url = "https://7wo7odchxb.execute-api.us-east-1.amazonaws.com/dev/search?" + options

      // GET request
      axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: "Bearer " + idToken.getJwtToken()
        },
      })
        .then(res => {
          console.log("response", res)
        })
        .catch(err => {
          console.log("Error", err)
        })
    }
  }

  return (
    <Box display="flex" alignItems="center" flexDirection="column" top="40%" left="25%" right="25%" position="absolute" mx="auto">
      <Typography variant="h1">Run Query</Typography>
      <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Enter tags seperated by ','" id="tags" onChange={handleTextChange.bind(this)} />
      <Button variant="contained" onClick={generateTags}>Execute</Button>
      <Button variant="contained" onClick={handleBackClick}>Back</Button>
    </Box>
  );
}