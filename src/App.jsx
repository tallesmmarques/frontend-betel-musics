import {useEffect, useState} from "react"
import api from "./service/api"

import Loading from "./components/loading"
import Home from "./pages/home"

function App() {
  const [musics, setMusics] = useState([{
    id: 0,
    name: "",
    author: "",
    linkCifra: "",
    linkYoutube: "",
    ministeriosInfo: [{
      id: 0,
      ministerio: "",
      lastPlayed: "",
      tom: "",
    }]
  }])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({on: false, music: {}})

  useEffect(() => {
    api.get("/music")
      .then(res => {
        setMusics(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [])

  const handleUpdate = (event, music) => {
    setUpdating(past => ({on: true, music}))
  }
  const handleSave = (event, confirmation, music) => {
    if (confirmation === "cancelar") setUpdating(past => ({...past, on: false}))
    else {
      api.put(`/music/${music.id}`, updating.music)
        .then(res => {
          console.log(res)
          setUpdating(past => ({on: false, music: {} }))
          document.location.reload()
        })
        .catch(err => console.log(err))
    }
  }
  const handleInput = (event) => {
    setUpdating(past => ({...past, music: {...past.music, [event.target.name]: event.target.value}}))
  }

  if(loading) {
    return <Loading/>
  }

  return (
    <Home musics={musics} />
  );
}

export default App;
