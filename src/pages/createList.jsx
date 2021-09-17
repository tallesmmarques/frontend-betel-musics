import { AddIcon } from "@chakra-ui/icons"
import { Box, Button, Center, FormControl, FormLabel, Heading, HStack, Input, Select, Stack, IconButton, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import api from "../service/api"
import { ministeriosNames } from "../service/definitions"

function CreateList({ fetchMusics, musicsData }) {
  const [value, setValue] = useState({
    title: "",
    ministerio: "",
    date: ""
  })
  const [musics, setMusics] = useState([{ id: 0 }])
  const [selMusic, setSelMusic] = useState()
  const history = useHistory()

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangeSelMusic = (e) => {
    setSelMusic(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    api.post("/event", { ...value, musics }).then(res => {
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

            <FormControl>
              <FormLabel>Adicionar Músicas</FormLabel>
              <HStack spacing={4} >
                <Select onChange={handleChangeSelMusic} name="selmusic" value={selMusic} placeholder="Selecionar uma música" isRequired>
                  {musicsData
                    .map(music => (
                      <option key={music.id} value={music.id}>{music.name} - {music.author}</option>
                    ))}
                </Select>
                <IconButton onClick={() => setMusics(prev => [...prev, selMusic])} colorScheme="gray" variant="solid" icon={<AddIcon />} />
              </HStack>
            </FormControl>

            {musics.map(music => (
              <Text>{music.name} - {music.author}</Text>
            ))}

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
