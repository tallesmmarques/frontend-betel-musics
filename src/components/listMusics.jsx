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
  Select,
  FormControl,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react"
import {
  AddIcon, CalendarIcon, CheckIcon, CloseIcon, EditIcon, ExternalLinkIcon, SearchIcon
} from "@chakra-ui/icons"
import { genders, ministeriosNames } from "../service/definitions"
import { addDays } from "date-fns/esm"
import api from "../service/api"
import { useRef } from "react"
import { useState } from "react"
import Dialog from "./dialog"
import { useEffect } from "react"

function ListMusics({ musics, title, isEvent, setGenderFilter, event, setEventMusics, setMusics, setEvents, fetchMusics, search, handleSearch, allMusics }) {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState()
  const onClose = () => setIsOpen()
  const cancelRef = useRef()

  useEffect(() => {
    const listMusics = allMusics.filter(music => music.selected)
    setEventMusics(listMusics)
  }, [allMusics, setEventMusics])

  const handleCreateList = () => {
    history.push("/createlist")
  }
  const handlePlayed = async () => {
    event.musics
      .filter(music => music.selected)
      .forEach(async music => {
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
  const handleChangeEventsMusics = (e) => {
    setEvents(prev => {
      const newEvents = prev
        .map(ev => ev.id === event.id ? (
          {
            ...ev, musics: ev.musics
              .map(ms => ms.id === Number(e.target.name) ? (
                { ...ms, selected: !ms.selected }
              ) : ms)
          }
        ) : ev)
      return newEvents
    })
  }

  const haveList = allMusics.map(m => m.selected).reduce((p, c) => p || c, false)

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
          setGenderFilter={setGenderFilter}
          isEvent={isEvent}
          event={event}
          haveList={haveList}
        />
      )}

      <Accordion allowToggle mx="0px" bg="white">
        {(isEvent ? event.musics : musics).map((music) => {
          const ministerios = ministeriosNames.map(name =>
            music.ministeriosInfo.find(mi => mi.ministerio === name)
          )
          return (
            <AccordionItem key={music.id}>
              <h2>
                <AccordionButton>
                  {!isEvent ?
                    <Checkbox pr="15px" size="lg" name={music.id}
                      onChange={(e) => {
                        setMusics(prev => {
                          const newMusics = prev
                            .flatMap(c => {
                              const tm = c.id === Number(e.target.name) ?
                                { ...c, selected: !c.selected } : c;
                              return tm
                            })
                          return newMusics
                        })
                      }}
                      isChecked={music.selected}
                    /> :
                    <Checkbox pr="15px" size="lg" name={music.id}
                      onChange={handleChangeEventsMusics}
                      isChecked={music.selected}
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
                    {ministeriosNames.map((head) => (
                      <Text isTruncated key={head}><b>- {head}</b></Text>
                    ))}
                    {["CifraClub", "Youtube"].map(head => (
                      <Text key={head}><b>{head}</b></Text>
                    ))}
                  </VStack>

                  <VStack flex="1" align="left" pl="1.5rem">
                    {[music.name, music.author, music.gender].map((value, index) => (
                      <Text key={index} isTruncated>{value}</Text>
                    ))}

                    {ministerios.map(value => (
                      <Box h="1.5rem" key={value?.id} isTruncated>
                        <Badge textTransform="none" colorScheme="purple">{value?.tom ? `tom ${value?.tom}` : "nenhum Tom"}</Badge>
                        <Badge textTransform="none" colorScheme={
                          value?.lastPlayed ? (
                            differenceInDays(new Date(), addDays(new Date(value?.lastPlayed), 1)) <= 7 ? "red" : (
                              differenceInDays(new Date(), addDays(new Date(value?.lastPlayed), 1)) <= 14 ? "orange" : "green"
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
          <Button colorScheme="orange" variant="solid" onClick={() => setIsOpen(true)}>Tocada <CheckIcon ml="10px" /> </Button>
          <Button colorScheme={haveList ? "yellow" : "green"} variant="solid" ml="10px" onClick={() => history.push(`/updatelist/${event.id}`)}>Editar <EditIcon ml="10px" /> </Button>
        </Flex>
      )}

      <Dialog
        action={handlePlayed}
        header="Encerrar Evento"
        body={(
          <Flex flexDirection="column">
            <Text fontWeight="bold">As datas das seguintes músicas seram atualizadas:</Text>
            <UnorderedList py="10px" pl="10px">
              {isEvent && event.musics
                .filter(music => music.selected)
                .map(music =>
                  <ListItem color="blue.700">{music.name}</ListItem>
                )}
            </UnorderedList>
            <Text>Caso não tenho tocado alguma destas, basta desmarcar a caixinha ao lado da música</Text>
          </Flex>
        )}
        cancelRef={cancelRef}
        colorScheme="green"
        isOpen={isOpen}
        onClose={onClose}
        actionText="Confirmar"
      />
    </Box >
  )
}

function Header({ title, search, handleSearch, setGenderFilter, genderFilter, isEvent, event, haveList, handleCreateList }) {
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
          <IconButton colorScheme="blue" ml="10px" variant="solid" as={ReactLink} to="/create" icon={<AddIcon />} />
        )}
      </Flex>

      <InputGroup>
        <InputRightElement children={search === "" ? <SearchIcon /> : (
          <IconButton icon={<CloseIcon />} variant="ghost" onClick={() => handleSearch({ target: { value: "" } })} />
        )} />
        <Input value={search} onChange={handleSearch} borderColor="blue.500" border="1px" variant="filled" bg="white" placeholder="Pesquisar por música ou artista" />
      </InputGroup>

      <FormControl>
        <Select bg="white" variant="outline" borderColor="blue.500" onChange={(e) => setGenderFilter(e.target.value)} value={genderFilter}>
          <option value="">Todos gêneros</option>
          {genders.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Select>
      </FormControl>
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
