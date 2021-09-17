import { Box, Button, Center, FormControl, FormLabel, Heading, HStack, IconButton, Input, ListItem, Select, Stack, UnorderedList } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import api from "../service/api"
import { ministeriosNames } from "../service/definitions"
import Dialog from "../components/dialog"
import Loading from "../components/loading"

function UpdateList({ fetchMusics, eventMusics, events }) {
  const [value, setValue] = useState({
    title: "",
    ministerio: "",
    date: ""
  })
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()
  const history = useHistory()
  const { id } = useParams()

  const musicsToDelete = events
    .find(e => e.id === Number(id))
    .musics
    .filter(mus => !mus.selected)
  const musicsToNotDelete = events
    .find(e => e.id === Number(id))
    .musics
    .filter(mus => mus.selected)

  useEffect(() => {
    setLoading(true)
    api.get(`/event/${id}`).then(res => {
      const data = res.data
      setValue(data)
      setLoading(false)
    }).catch(err => console.log(err))
  }, [id])

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...value, musics: [...eventMusics, ...musicsToNotDelete] }
    api.put(`/event/${id}`, data).then(res => {
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }
  const handleDelete = async (e) => {
    await api.delete(`/event/${id}`).then(res => {
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="450px" borderRadius="sm" shadow="md" overflowX="auto">
        <form onSubmit={handleSubmit} autoComplete="off">
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Editar Lista</Heading>

            <FormControl>
              <FormLabel>Nome do evento</FormLabel>
              <Input onChange={handleChange} name="title" value={value.title} placeholder="Nome do Evento" isRequired />
            </FormControl>

            <FormControl>
              <Select onChange={handleChange} name="ministerio" value={value.ministerio} placeholder="Quem irá cantar" isRequired>
                {ministeriosNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Dia do evento</FormLabel>
              <Input type="date" onChange={handleChange} name="date" value={value.date} placeholder="Dia do evento" isRequired />
            </FormControl>

            <Heading size="md" pt="20px">Músicas atuais:</Heading>
            <UnorderedList pl="10px">
              {value?.musics.map(music =>
                <ListItem m="10px" key={music.id}>{music.name} - {music.author}</ListItem>
              )}
            </UnorderedList>

            {eventMusics === [] && (
              <>
                <Heading size="md" pt="20px">Músicas há serem adicionadas:</Heading>
                <UnorderedList pl="10px">
                  {eventMusics.map(music =>
                    <ListItem m="10px" color="green.600" key={music.id}>{music.name} - {music.author}</ListItem>
                  )}
                </UnorderedList>
              </>
            )}

            {musicsToDelete === [] && (
              <>
                <Heading size="md" pt="20px">Músicas há serem removidas:</Heading>
                <UnorderedList pl="10px">
                  {musicsToDelete.map(music =>
                    <ListItem m="10px" color="red.600" key={music.id}>{music.name} - {music.author}</ListItem>
                  )}
                </UnorderedList>
              </>
            )}

            <HStack spacing={4} pt={5}>
              <Button flex="1" colorScheme="blue" variant="outline" onClick={() => history.push("/")}>Cancelar</Button>
              <Button flex="1" type="submit" colorScheme="blue">Enviar</Button>
              <IconButton icon={<DeleteIcon />} onClick={() => setIsOpen(true)} size="md" colorScheme="red" />
            </HStack>
          </Stack>
        </form>
      </Box>

      <Dialog
        action={handleDelete}
        header="Apagar Evento"
        body="Tem certeza? Você não pode desfazer esta ação depois."
        cancelRef={cancelRef}
        colorScheme="red"
        isOpen={isOpen}
        onClose={onClose}
        actionText="Apagar"
      />
    </Center>
  )
}

export default UpdateList

