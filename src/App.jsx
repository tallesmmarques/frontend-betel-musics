import {useEffect, useState} from "react"
import api from "./service/api"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Loading from "./components/loading"
import Home from "./pages/home"
import Create from "./pages/create";
import Update from "./pages/update";

function App() {
  const [musics, setMusics] = useState([{
    id: 0,
    name: "",
    author: "",
    gender: "",
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

  useEffect(() => {
    fetchMusics()
  }, [])

  const fetchMusics = async () => {
    setLoading(true)
    await api.get("/music")
      .then(res => {
        setMusics(res.data)
        setLoading(false)
        console.log(res.data)
      })
      .catch(err => console.error(err))
  }

  if(loading) {
    return <Loading/>
  }

  return (
    <Router>
      <Switch>
        <Route path="/create">
          <Create fetchMusics={fetchMusics} />
        </Route>
        <Route path="/update/:id">
          <Update fetchMusics={fetchMusics} setLoading={setLoading} />
        </Route>
        <Route path="/">
          <Home musics={musics}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

  // const [updating, setUpdating] = useState({on: false, music: {}})
  //
  // const handleUpdate = (event, music) => {
  //   setUpdating(past => ({on: true, music}))
  // }
  // const handleSave = (event, confirmation, music) => {
  //   if (confirmation === "cancelar") setUpdating(past => ({...past, on: false}))
  //   else {
  //     api.put(`/music/${music.id}`, updating.music)
  //       .then(res => {
  //         console.log(res)
  //         setUpdating(past => ({on: false, music: {} }))
  //         document.location.reload()
  //       })
  //       .catch(err => console.log(err))
  //   }
  // }
  // const handleInput = (event) => {
  //   setUpdating(past => ({...past, music: {...past.music, [event.target.name]: event.target.value}}))
  // }