import { Link as ReactLink, useHistory } from "react-router-dom"
import { format, differenceInDays, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Box,
  Flex,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  VStack,
  Link,
  Badge,
  IconButton,
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  useMediaQuery,
  Checkbox,
} from "@chakra-ui/react"
import {
  AddIcon, CalendarIcon, CheckIcon, DeleteIcon, EditIcon, ExternalLinkIcon, SearchIcon
} from "@chakra-ui/icons"
import { useState } from "react"
import { ministeriosNames } from "../service/definitions"
import { addDays } from "date-fns/esm"
import api from "../service/api"

function ListMusics({ musics, title, isEvent, event, setEventMusics, fetchMusics }) {
  const [search, setSearch] = useState("")
  const [list, setList] = useState({})
  const history = useHistory()

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  const handleCreateList = () => {
    let listIds = []
    for (const [key, value] of Object.entries(list)) {
      if (value) listIds.push(Number(key))
    }
    const listMusics = musics.flatMap(music => listIds.includes(music.id) ? [music] : [])
    setEventMusics(listMusics)
    history.push("/createlist")
  }
  const handlePlayed = async () => {
    api.put("/music")

    event.musics.forEach(async music => {
      await api.put(`/music/${music.id}/${event.ministerio}`, {
        lastPlayed: event.date
      }).then(res => {
        fetchMusics()
      }).catch(err => console.log(err))
    })

    handleDelete()
  }

  const handleDelete = async () => {
    await api.delete(`/event/${event.id}`).then(res => {
      fetchMusics()
    })
  }

  return (
    <Box py="20px">
      {isEvent ? (
        <HeaderEvent
          event={event}
        />
      ) : (
        <Header
          title={title}
          search={search}
          handleSearch={handleSearch}
          handleCreateList={handleCreateList}
          isEvent={isEvent}
          event={event}
          haveList={Object.values(list).find(e => e)}
        />
      )}

      <Accordion allowToggle mx="0px" bg="white">
        {(isEvent ? event.musics : musics).map((music, index) => {
          const ministerios = ministeriosNames.map(name =>
            music.ministeriosInfo.find(mi => mi.ministerio === name)
          )
          return (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  {!isEvent &&
                    <Checkbox pr="15px" size="lg" name={music.id}
                      onChange={(e) => setList(prev => ({ ...prev, [e.target.name]: e.target.checked }))}
                      isChecked={list[music.id]}
                    />
                  }
                  <Text flex="1" textAlign="left" isTruncated>
                    <b>{music.name}</b> - {music.author}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} overflowX="auto">
                <Flex>
                  <VStack align="left" pl="1rem">
                    {["Música", "Artista", "Gênero"].map(head => (
                      <Text key={head}><b>{head}</b></Text>
                    ))}
                    {ministeriosNames.map(head => (
                      <Text isTruncated key={head}><b>- {head}</b></Text>
                    ))}
                    {["CifraClub", "Youtube"].map(head => (
                      <Text key={head}><b>{head}</b></Text>
                    ))}
                  </VStack>

                  <VStack flex="1" align="left" pl="1.5rem">
                    {[music.name, music.author, music.gender].map(value => (
                      <Text key={value} isTruncated>{value}</Text>
                    ))}

                    {ministerios.map(value => (
                      <Box h="1.5rem" key={value?.id} isTruncated>
                        <Badge textTransform="none" colorScheme="purple">{value?.tom ? `tom ${value?.tom}` : "nenhum Tom"}</Badge>
                        <Badge textTransform="none" colorScheme={
                          value?.lastPlayed ? (
                            differenceInDays(new Date(), new Date(value?.lastPlayed)) <= 7 ? "red" : (
                              differenceInDays(new Date(), new Date(value?.lastPlayed)) <= 14 ? "orange" : "green"
                            )) : "blue"
                        } ml="2">{
                            value?.lastPlayed ? `tocada há ${formatDistanceToNow(new Date(value?.lastPlayed), { locale: ptBR })}` : "não tocada"
                          }</Badge>
                      </Box>
                    ))}

                    {[music?.linkCifra, music?.linkYoutube].map((value, index) => (
                      value !== "" ? (
                        <Link key={index} color="blue.500" textDecoration="underline" href={value} isExternal> Acessar Link < ExternalLinkIcon mx="2px" mb="2px" /></Link>
                      ) : <Text key={index} color="red.400" isTruncated>Sem link</Text>
                    ))}
                  </VStack>
                  <IconButton icon={<EditIcon />} variant="solid" w="20px" mx="10px" as={ReactLink} to={`/update/${music.id}`} />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion >

      {isEvent && (
        <Flex mt="10px" px="20px" justifyContent="flex-end">
          <Button colorScheme="yellow" variant="solid" onClick={handlePlayed}>Tocada <CheckIcon ml="10px" /> </Button>
          <Button colorScheme="red" variant="solid" ml="10px" onClick={handleDelete}>Remover <DeleteIcon ml="10px" /> </Button>
        </Flex>
      )}
    </Box >
  )
}

function Header({ title, search, handleSearch, isEvent, event, haveList, handleCreateList }) {
  return (
    <VStack spacing={5} mb="0px" p="20px" align="left" >
      <Flex align="flex-end">
        <Heading size="lg" textTransform="capitalize" flex="1">{title}</Heading>

        {haveList &&
          <IconButton colorScheme="green"
            variant="solid" onClick={handleCreateList}
            icon={<CalendarIcon />}
          />
        }

        {useMediaQuery("(min-width: 380px)")[0] ? (
          <Button ml="10px" colorScheme="blue" variant="solid" as={ReactLink} to="/create">
            <AddIcon mr="10px" /> Criar Música
          </Button>
        ) : (
          <IconButton colorScheme="blue" variant="solid" as={ReactLink} to="/create" icon={<AddIcon />} />
        )}
      </Flex>

      <InputGroup>
        <InputRightElement children={<SearchIcon />} />
        <Input value={search} onChange={handleSearch} borderColor="blue.500" border="1px" variant="filled" bg="white" placeholder="Pesquisar por música ou artista" />
      </InputGroup>
    </VStack >
  )
}

function HeaderEvent({ event }) {
  return (
    <VStack spacing={5} p="20px" pb="10px" align="flex-start" >
      <Flex align="flex-start" direction="column">
        <Heading size="md" textTransform="initial">{event.ministerio} - {event.title}</Heading>
        <Text>{format(addDays(new Date(event.date), 1), "PPPP", { locale: ptBR })}</Text>
      </Flex>
    </VStack >
  )
}

export default ListMusics
