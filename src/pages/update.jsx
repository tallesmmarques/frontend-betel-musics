import { Box, Button, Center, Divider, Heading, HStack, Input, Select, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import api from "../service/api"

function Update ({fetchMusics, setLoading}) {
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
  const { id } = useParams()
  useEffect(() => {
    api.get(`/music/${id}`).then(res => {
      const data = res.data
      setValue(data)

      const alber = data.ministeriosInfo.find(e => e.ministerio === "sdn-alber")?.tom
      const lucymeire = data.ministeriosInfo.find(e => e.ministerio === "sdn-lucimeire")?.tom
      const adolescentes = data.ministeriosInfo.find(e => e.ministerio === "adolescentes")?.tom
      const ministerios = {
        "sdn-alber": alber,
        "sdn-lucimeire": lucymeire,
        adolescentes: adolescentes
      }
      setMinisterios(ministerios)
    }).catch(err => console.log(err))
  }, [id])

  const handleChange = (e) => {
    setValue(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  const handleChangeTom = (e) => {
    setMinisterios(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.put(`/music/${id}`, value).then(res => {
      (["sdn-alber", "sdn-lucimeire", "adolescentes"]).forEach(async element => {
        await api.put(`/music/${id}/${element}`, {
          tom: ministerios[element],
          ministerio: element
        }).then(res => {
          fetchMusics()
          history.push("/")
        }).catch(err => console.log(err))
      });
    }).catch(err => console.log(err))
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="450px" borderRadius="sm" shadow="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Atualizar Música</Heading>

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
            <Text><b>Tom:</b> Alber / Lucymeire / Adolescentes</Text>
            <HStack spacing={4}>
              <Input onChange={handleChangeTom} name="sdn-alber" value={ministerios["sdn-alber"]} placeholder="Alber"/>
              <Input onChange={handleChangeTom} name="sdn-lucimeire" value={ministerios["sdn-lucimeire"]} placeholder="Lucymeire"/>
              <Input onChange={handleChangeTom} name="adolescentes" value={ministerios.adolescentes} placeholder="Adolescentes"/>
            </HStack>

            <HStack spacing={4} pt={5}>
              <Button flex="1" colorScheme="red" onClick={() => history.push("/")}>Cancelar</Button>
              <Button flex="1" type="submit" colorScheme="blue">Enviar</Button>
            </HStack>
          </Stack>
        </form>
      </Box>
    </Center>
  )
}

export default Update
