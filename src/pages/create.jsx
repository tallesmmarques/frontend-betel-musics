import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Divider, Heading, HStack, Input, InputGroup, Select, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"

import api from "../service/api"
import { ministeriosNames, genders } from "../service/definitions"
import SearchMusic from "../components/searchMusic"

function Create({ fetchMusics }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState({
    name: "",
    author: "",
    gender: "",
    linkCifra: "",
    linkYoutube: ""
  })
  const [tons, setTons] = useState(
    ministeriosNames.reduce((p, c) => ({ ...p, [c]: "" }))
  )
  const history = useHistory()

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangeTom = (e) => {
    setTons(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = (e) => {
    const ministeriosInfo = ministeriosNames.map(name => ({
      ministerio: name,
      tom: tons[name]
    }))
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
        <form onSubmit={handleSubmit} autoComplete="off">
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Criar Música</Heading>

            <Button colorScheme="yellow" onClick={onOpen}>
              Pesquisar por música <SearchIcon ml="10px" />
            </Button>

            <InputGroup>
              <Input onChange={handleChange} name="name" value={value.name} placeholder="Música" isRequired />
            </InputGroup>

            <Input onChange={handleChange} name="author" value={value.author} placeholder="Artista" isRequired />
            <Select onChange={handleChange} name="gender" value={value.gender} placeholder="Selecione um Gênero" isRequired>
              {genders.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
              ))}
            </Select>
            <HStack spacing={4}>
              <Input onChange={handleChange} name="linkCifra" value={value.linkCifra} type="url" placeholder="Link CifraClub" />
              <Input onChange={handleChange} name="linkYoutube" value={value.linkYoutube} type="url" placeholder="Link Youtube" />
            </HStack>
            <Divider />
            <Text><b>Tom:</b> {ministeriosNames.join(" / ")}</Text>
            <HStack spacing={4}>
              {ministeriosNames.map(name => (
                <Input key={name} onChange={handleChangeTom} name={name} value={tons[name]} placeholder={name} />
              ))}
            </HStack>
            <HStack spacing={4} pt={5}>
              <Button variant="outline" flex="1" colorScheme="blue" onClick={() => history.push("/")}>Cancelar</Button>
              <Button flex="1" type="submit" colorScheme="blue">Enviar</Button>
            </HStack>
          </Stack>
        </form>
      </Box>

      <SearchMusic
        isOpen={isOpen}
        onClose={onClose}
        value={value}
        setValue={setValue}
      />
    </Center>
  )
}

export default Create
