import { Box, Button, Center, FormControl, FormLabel, Heading, HStack, Input, Select, Stack, ListItem, UnorderedList } from "@chakra-ui/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import api from "../service/api"
import { ministeriosNames } from "../service/definitions"

function CreateList({ fetchMusics, eventMusics }) {
  const [value, setValue] = useState({
    title: "",
    ministerio: "",
    date: ""
  })
  const history = useHistory()

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    api.post("/event", { ...value, musics: eventMusics }).then(res => {
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="450px" borderRadius="sm" shadow="md" overflowX="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Criar Lista</Heading>

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

            <Heading size="md" pt="20px">Músicas adicionadas:</Heading>
            <UnorderedList pl="10px">
              {eventMusics.map(music =>
                <ListItem m="10px" key={music.id}>{music.name} - {music.author}</ListItem>
              )}
            </UnorderedList>

            <HStack spacing={4} pt={5}>
              <Button variant="outline" flex="1" colorScheme="blue" onClick={() => history.push("/")}>Cancelar</Button>
              <Button flex="1" type="submit" colorScheme="blue">Enviar</Button>
            </HStack>
          </Stack>
        </form>
      </Box>
    </Center>
  )
}

export default CreateList
