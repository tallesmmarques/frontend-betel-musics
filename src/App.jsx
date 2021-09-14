import {useEffect, useState} from "react"
import {Box, ChakraProvider, Text, Flex, Heading, Table, Thead, Tbody, Tr, Th, Button, Link, CircularProgress} from "@chakra-ui/react"
import {AddIcon, ExternalLinkIcon} from "@chakra-ui/icons"
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

  // useEffect(() => {
  //   console.log(musics)
  // }, [musics])

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
    return <ChakraProvider>
      <Flex bg="#f3f4f5" minH="100vh" align="center" justify="center">
        <CircularProgress isIndeterminate size="50px" />
      </Flex>
    </ChakraProvider>
  }

  return (
    <ChakraProvider>
      <Flex bg="#f3f4f5" minH="100vh" flexDirection="column">

        <Box h="5px" bg="blue.500"></Box>

        <Box p="50px" bg="white" boxShadow="sm">
          <Text pb="5px" color="blackAlpha.500">Coletânia de Músicas</Text>
          <Heading>Betel Musics</Heading>
        </Box>

        <Box p="50px" px="100px">
          <Flex pb="20px" align="center" >
            <Heading flex="1" size="md">Todas Músicas</Heading>
            <Button colorScheme="blue" variant="outline" maxW="150px"><AddIcon mr="10px"/> Criar Música</Button>
          </Flex>
          <Table variant="simple" bg="white" boxShadow="sm">
            <Thead>
              <Tr>
                {["Música", "Artista", "Gênero", "Alber", "Lucimeire", "Adolescentes", "CifraClub", "Youtube"].map(field => (
                  <Th key={field} pt="15px" fontSize="11px" fontWeight="bold" isTruncated>{field}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {musics.map(music => {
                const tomAlber = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-alber")?.tom
                const tomLucimeire = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-lucimeire")?.tom
                const tomAdolescentes = music.ministeriosInfo.find(mi => mi.ministerio === "adolescentes")?.tom
                return (
                  <Tr key={music.id}>
                    <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.name}</Th>
                    <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.author}</Th>
                    <Th textTransform="none" fontSize="14px" minW="100px" bg="gray.50" fontWeight="light" isTruncated>Adoração</Th>
                    {/* {[music.author, "Adoração"].map(field => (
                      <Th key={field} textTransform="none" maxW="200px" fontSize="14px" fontWeight="light" isTruncated>{field}</Th>
                    ))} */}
                    {[tomAlber, tomLucimeire, tomAdolescentes].map(field => (
                      <Th key={field} textTransform="none" maxW="50px" fontSize="14px" fontWeight="light">{field}</Th>
                    ))}
                    {[music.linkCifra, music.linkYoutube].map(field => (
                      <Th key={field} textTransform="none" fontSize="14px" fontWeight="light" textOverflow="ellipsis">
                        <Link href={field} isExternal>Acessar Link <ExternalLinkIcon mx="2px" mb="2px"/></Link>
                      </Th>
                    ))}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </ChakraProvider>
    // <div>
    //   {musics.map(music => (
    //     <div key={music.id}>
    //       <p>{music?.name} - {music?.author}</p>
    //       <button name={music.id} onClick={(e) => handleUpdate(e, music)} disabled={updating.on}>Atualizar</button>
    //     </div>
    //   ))}

    //   {updating.on ? (<div>
    //     <h2>Atualizando {updating.music.name}</h2>
    //     {["name", "author", "linkCifra", "linkYoutube"].map(field => (
    //       <input key={field} type="text" name={field} value={updating.music[field]} onChange={handleInput} />
    //     ))}

    //     <button onClick={(e) => handleSave(e, "cancelar", updating.music)}>Cancelar</button>
    //     <button onClick={(e) => handleSave(e, "save", updating.music)}>Salvar</button>
    //   </div>
    //   ) : <></>}
    // </div>
  );
}

export default App;
