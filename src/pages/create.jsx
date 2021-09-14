import { Box, Button, Center, Divider, Heading, HStack, Input, Select, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import {useHistory} from "react-router-dom"
import api from "../service/api"

function Create ({fetchMusics}) {
  const generos = ["Adoração", "Worship", "Corinho", "Comunhão"]
  const [value, setValue] = useState({
    name: "",
    author: "",
    gender: "",
    linkCifra: "",
    linkYoutube: ""
  })
  const [ministerios, setMinisterios] = useState({
    "sdn-alber": "",
    "sdn-lucimeire": "",
    adolescentes: ""
  })
  const history = useHistory()

  const handleChange = (e) => {
    setValue(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  const handleChangeTom = (e) => {
    setMinisterios(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  const handleSubmit = (e) => {
    const ministeriosInfo = [
      {ministerio: "sdn-alber", tom: ministerios["sdn-alber"]},
      {ministerio: "sdn-lucimeire", tom: ministerios["sdn-lucimeire"]},
      {ministerio: "adolescentes", tom: ministerios["adolescentes"]}
    ]
    e.preventDefault()
    api.post("/music", {
      ...value,
      ministeriosInfo
    }).then(res => {
      console.log(res)
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="450px" borderRadius="sm" shadow="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Criar Música</Heading>

            <Input onChange={handleChange} name="name" value={value.name} placeholder="Música" isRequired/>
            <Input onChange={handleChange} name="author" value={value.author} placeholder="Artista" isRequired/>
            <Select onChange={handleChange} name="gender" value={value.gender} placeholder="Selecione um Gênero" isRequired>
              {generos.map(genero => (
                <option key={genero} value={genero}>{genero}</option>
              ))}
            </Select>
            <HStack spacing={4}>
              <Input onChange={handleChange} name="linkCifra" value={value.linkCifra} type="url" placeholder="Link CifraClub"/>
              <Input onChange={handleChange} name="linkYoutube" value={value.linkYoutube} type="url" placeholder="Link Youtube"/>
            </HStack>
            <Divider/>
            <Text>Tom:</Text>
            <HStack spacing={4}>
              <Input onChange={handleChangeTom} name="sdn-alber" value={ministerios["sdn-alber"]} placeholder="Alber"/>
              <Input onChange={handleChangeTom} name="sdn-lucimeire" value={ministerios["sdn-lucimeire"]} placeholder="Lucymeire"/>
              <Input onChange={handleChangeTom} name="adolescentes" value={ministerios.adolescentes} placeholder="Adolescentes"/>
            </HStack>
            <Button type="submit" colorScheme="blue">Enviar</Button>
          </Stack>
        </form>
      </Box>
    </Center>
  )
}

export default Create