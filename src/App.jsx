import { useEffect, useState } from "react"
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
import CreateList from "./pages/createList";
import UpdateList from "./pages/updateList";

function App() {
  const musicsTemplate = {
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
    }],
    selected: true
  }
  const [musics, setMusics] = useState([musicsTemplate])
  const [events, setEvents] = useState([{
    id: 0,
    title: "",
    ministerio: "",
    musics: musicsTemplate
  }])
  const [loading, setLoading] = useState(true)
  const [eventMusics, setEventMusics] = useState([{}])

  useEffect(() => {
    fetchMusics()
  }, [])

  const fetchMusics = async () => {
    setLoading(true)
    await api.get("/music")
      .then(async res => {
        setMusics(res.data.map(music => ({ ...music, selected: false })))
        await api.get("/event")
          .then(res => {
            setEvents(res.data.map(event => {
              const musicsSel = event.musics.map(m => ({ ...m, selected: true }))
              return ({ ...event, musics: musicsSel })
            }))
            setLoading(false)
          })
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Router>
      <Switch>
        <Route path="/create">
          <Create fetchMusics={fetchMusics} />
        </Route>
        <Route path="/update/:id">
          <Update fetchMusics={fetchMusics} />
        </Route>
        <Route path="/createlist">
          <CreateList eventMusics={eventMusics} fetchMusics={fetchMusics} />
        </Route>
        <Route path="/updatelist/:id">
          <UpdateList eventMusics={eventMusics} fetchMusics={fetchMusics} />
        </Route>
        <Route path="/">
          <Home
            fetchMusics={fetchMusics}
            musics={musics}
            events={events}
            setMusics={setMusics}
            setEventMusics={setEventMusics}
            setEvents={setEvents}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
