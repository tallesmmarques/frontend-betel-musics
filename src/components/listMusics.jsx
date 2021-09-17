import { Link as ReactLink } from "react-router-dom"
import { differenceInDays, formatDistanceToNow } from "date-fns"
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
} from "@chakra-ui/react"
import {
  AddIcon, EditIcon, ExternalLinkIcon, SearchIcon
} from "@chakra-ui/icons"
import { useState } from "react"
import { ministeriosNames } from "../service/definitions"

function ListMusics({ musics, title, isEvent, event }) {
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <Box py="20px">
      <Header
        title={title}
        search={search}
        handleSearch={handleSearch}
        isEvent={isEvent}
        event={event}
      />

      <Accordion allowToggle mx="0px" bg="white">
        {(isEvent ? event.musics : musics).map((music, index) => {
          const ministerios = ministeriosNames.map(name =>
            music.ministeriosInfo.find(mi => mi.ministerio === name)
          )
          return (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
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
    </Box >
  )
}

function Header({ title, search, handleSearch, isEvent, event }) {
  const isSmall = useMediaQuery("(min-width: 400px)")[0]
  return (
    <VStack spacing={5} mb="0px" p="20px" align="left" >
      <Flex>
        {isEvent ?
          <Heading size="md" textTransform="initial" flex="1">{event.ministerio} - {event.title}</Heading>
          :
          <Heading size="lg" textTransform="capitalize" flex="1">{title}</Heading>
        }

        {!isEvent && (
          !isSmall ? (
            <IconButton colorScheme="blue" variant="solid" as={ReactLink} to="/create" icon={<AddIcon />} />
          ) : (
            <Button colorScheme="blue" variant="solid" as={ReactLink} to="/create">
              <AddIcon mr="10px" /> Criar Música
            </Button>
          )
        )}
      </Flex>

      {
        !isEvent &&
        <InputGroup>
          <InputRightElement children={<SearchIcon />} />
          <Input value={search} onChange={handleSearch} borderColor="blue.500" border="1px" variant="filled" bg="white" placeholder="Pesquisar por música ou artista" />
        </InputGroup>
      }
    </VStack >
  )
}

export default ListMusics
