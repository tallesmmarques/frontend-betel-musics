import {useEffect, useState} from "react"
import api from "./service/api"

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

  useEffect(() => {
    console.log(musics)
  }, [musics])
  // useEffect(() => {
  //   console.log(updating)
  // }, [updating])

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
    return <div>
      <h1>Loading...</h1>
    </div>
  }

  return (
    <div>
      <h1>Hello World</h1>
      {musics.map(music => (
        <div key={music.id}>
          <p>{music?.name} - {music?.author}</p>
          <button name={music.id} onClick={(e) => handleUpdate(e, music)} disabled={updating.on}>Atualizar</button>
        </div>
      ))}

      {updating.on ? (<div>
        <h2>Atualizando {updating.music.name}</h2>
        {["name", "author", "linkCifra", "linkYoutube"].map(field => (
          <input key={field} type="text" name={field} value={updating.music[field]} onChange={handleInput} />
        ))}

        <button onClick={(e) => handleSave(e, "cancelar", updating.music)}>Cancelar</button>
        <button onClick={(e) => handleSave(e, "save", updating.music)}>Salvar</button>
      </div>
      ) : <></>}
    </div>
  );
}

export default App;
