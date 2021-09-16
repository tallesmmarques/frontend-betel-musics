import { Box, Button, Center, Divider, Heading, HStack, Input, Select, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import api from "../service/api"

function Create({ fetchMusics }) {
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
    "sdn-lucy": "",
    adolescentes: ""
  })
  const history = useHistory()

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangeTom = (e) => {
    setMinisterios(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = (e) => {
    const ministeriosInfo = [
      { ministerio: "sdn-alber", tom: ministerios["sdn-alber"] },
      { ministerio: "sdn-lucy", tom: ministerios["sdn-lucy"] },
      { ministerio: "adolescentes", tom: ministerios["adolescentes"] }
    ]
    e.preventDefault()
    api.post("/music", {
      ...value,
      ministeriosInfo
    }).then(res => {
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="450px" borderRadius="sm" shadow="md" overflowX="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Criar Música</Heading>

            <Input onChange={handleChange} name="name" value={value.name} placeholder="Música" isRequired />
            <Input onChange={handleChange} name="author" value={value.author} placeholder="Artista" isRequired />
            <Select onChange={handleChange} name="gender" value={value.gender} placeholder="Selecione um Gênero" isRequired>
              {generos.map(genero => (
                <option key={genero} value={genero}>{genero}</option>
              ))}
            </Select>
            <HStack spacing={4}>
              <Input onChange={handleChange} name="linkCifra" value={value.linkCifra} type="url" placeholder="Link CifraClub" />
              <Input onChange={handleChange} name="linkYoutube" value={value.linkYoutube} type="url" placeholder="Link Youtube" />
            </HStack>
            <Divider />
            <Text><b>Tom:</b> Alber / Lucy Mary / Adolescentes</Text>
            <HStack spacing={4}>
              <Input onChange={handleChangeTom} name="sdn-alber" value={ministerios["sdn-alber"]} placeholder="Alber" />
              <Input onChange={handleChangeTom} name="sdn-lucy" value={ministerios["sdn-lucy"]} placeholder="Lucy Mary" />
              <Input onChange={handleChangeTom} name="adolescentes" value={ministerios.adolescentes} placeholder="Adolescentes" />
            </HStack>
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

export default Create
