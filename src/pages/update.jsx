import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Center, Divider, Heading, HStack, IconButton, Input, Select, Stack, Text } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import api from "../service/api"

function Update({ fetchMusics, setLoading }) {
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
  const [lastPlayeds, setLastPlayeds] = useState({
    "sdn-alber": "",
    "sdn-lucimeire": "",
    adolescentes: ""
  })
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  const history = useHistory()
  const { id } = useParams()
  useEffect(() => {
    api.get(`/music/${id}`).then(res => {
      const data = res.data
      setValue(data)

      const alber = data.ministeriosInfo.find(e => e.ministerio === "sdn-alber")
      const lucymeire = data.ministeriosInfo.find(e => e.ministerio === "sdn-lucimeire")
      const adolescentes = data.ministeriosInfo.find(e => e.ministerio === "adolescentes")
      const ministerios = {
        "sdn-alber": alber?.tom,
        "sdn-lucimeire": lucymeire?.tom,
        adolescentes: adolescentes?.tom
      }
      setMinisterios(ministerios)
      const lastPlayeds = {
        "sdn-alber": alber?.lastPlayed,
        "sdn-lucimeire": lucymeire?.lastPlayed,
        adolescentes: adolescentes?.lastPlayed
      }
      setLastPlayeds(lastPlayeds)
    }).catch(err => console.log(err))
  }, [id])

  const handleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangeTom = (e) => {
    setMinisterios(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangeLast = (e) => {
    setLastPlayeds(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.put(`/music/${id}`, value).then(res => {
      (["sdn-alber", "sdn-lucimeire", "adolescentes"]).forEach(async element => {
        await api.put(`/music/${id}/${element}`, {
          tom: ministerios[element],
          ministerio: element,
          "lastPlayed": lastPlayeds[element]
        }).then(res => {
          fetchMusics()
          history.push("/")
        }).catch(err => console.log(err))
      });
    }).catch(err => console.log(err))
  }
  const handleDelete = async (e) => {
    await api.delete(`/music/${id}`).then(res => {
      fetchMusics()
      history.push("/")
    }).catch(err => console.log(err))
  }

  return (
    <Center bg="#f3f4f5" minH="100vh">
      <Box bg="white" p="1.5rem" py="2rem" w="550px" borderRadius="sm" shadow="md" overflowX="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="lg" textAlign="center" mb="1rem">Atualizar Música</Heading>

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
              <Input onChange={handleChangeTom} name="sdn-lucimeire" value={ministerios["sdn-lucimeire"]} placeholder="Lucy Mary" />
              <Input onChange={handleChangeTom} name="adolescentes" value={ministerios.adolescentes} placeholder="Adolescentes" />
            </HStack>
            <Text><b>Última vez tocada:</b> Alber / Lucy Mary / Adolescentes</Text>
            <HStack spacing={4}>
              <Input size="sm" type="date" onChange={handleChangeLast} name="sdn-alber" value={lastPlayeds["sdn-alber"]} />
              <Input size="sm" type="date" onChange={handleChangeLast} name="sdn-lucimeire" value={lastPlayeds["sdn-lucimeire"]} />
              <Input size="sm" type="date" onChange={handleChangeLast} name="adolescentes" value={lastPlayeds.adolescentes} />
            </HStack>

            <HStack spacing={4} pt={5}>
              <Button flex="1" colorScheme="blue" variant="outline" onClick={() => history.push("/")}>Cancelar</Button>
              <Button flex="1" type="submit" colorScheme="blue">Enviar</Button>
              <IconButton icon={<DeleteIcon />} onClick={() => setIsOpen(true)} size="md" colorScheme="red" />
            </HStack>
          </Stack>
        </form>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Apagar Música
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Você não pode desfazer esta ação depois.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Apagar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Center>
  )
}

export default Update
