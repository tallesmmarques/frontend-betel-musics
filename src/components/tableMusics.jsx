import { Link as ReactLink } from "react-router-dom"
import { differenceInDays, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Button,
  Link,
  IconButton,
  Select,
} from "@chakra-ui/react"
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { ministeriosNames } from "../service/definitions"

const prev = ["Música", "Artista", "Gênero"]
const pos = ["CifraClub", "Youtube", ""]

function TableMusics({ musics, title, ministerio }) {
  const [filter, setFilter] = useState("all")
  const [tableh, setTableh] = useState([...prev, ...ministeriosNames, ...pos])

  console.log()

  useEffect(() => {
    const mid = filter === "all" ? ministeriosNames : ministeriosNames[filter]
    setTableh([...prev, ...mid, ...pos])
  }, [filter])

  return (
    <Box p="50px" px="40px">
      <Header
        ministerio={ministerio}
        title={title}
        filter={filter}
        setFilter={setFilter}
      />

      <Box overflowX="auto">
        <Table variant="simple" colorScheme="blackAlpha" bg="white" boxShadow="sm">
          <Thead>
            <Tr>
              {tableh.map(field => (
                <Th key={field} pt="15px" fontSize="11px" fontWeight="bold" isTruncated>{field}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {musics.map(music => {
              const tom = ministeriosNames.reduce((p, c) => ({
                ...p, [c]: music.ministeriosInfo.find(mi => mi.ministerios === c)
              }))
              const lastPlayed = tom[filter]?.lastPlayed ? new Date(tom[filter]?.lastPlayed) : null

              return (
                <Tr key={music.id}>
                  <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.name}</Th>
                  <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.author}</Th>
                  <Th textTransform="none" fontSize="14px" minW="100px" fontWeight="light" isTruncated>{music.gender}</Th>
                  {filter === "all" && ministeriosNames.map((name) => (
                    <Th key={name} textTransform="none" maxW="50px" fontSize="14px" fontWeight="light">{tom[name]}</Th>
                  ))}
                  {filter !== "all" && (
                    <Th textTransform="none" maxW="50px" fontSize="14px" fontWeight="light">{
                      tom[filter]?.tom
                    }</Th>
                  )}
                  {filter !== "all" && (
                    <Th textTransform="none" minW="50px" fontSize="14px" fontWeight="light"
                      bg={lastPlayed ? (
                        differenceInDays(new Date(), lastPlayed) <= 7 ? "red.100" : (
                          differenceInDays(new Date(), lastPlayed) <= 14 ? "orange.100" : "green.100"
                        )) : "blue.100"}
                    >{
                        lastPlayed ? formatDistanceToNow(lastPlayed, { locale: ptBR }) : "Não tocada"
                      }</Th>
                  )}
                  {[music.linkCifra, music.linkYoutube].map((field, index) => (
                    <Th key={index} textTransform="none" fontSize="14px" fontWeight="light" textOverflow="ellipsis">
                      <Link href={field} isExternal>Acessar Link <ExternalLinkIcon mx="2px" mb="2px" /></Link>
                    </Th>
                  ))}

                  <Th maxW="55px" px="5px">
                    <IconButton icon={<EditIcon />} variant="link" maxW="150px" as={ReactLink} to={`/update/${music.id}`}>Edit</IconButton>
                  </Th>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>

    </Box>
  )
}

function Header({ ministerio, title, filter, setFilter }) {
  return (
    <Flex pb="20px" align="center" >
      <Heading flex="1" size="md" textTransform="capitalize">{title}</Heading>

      {ministerio === "all" ?
        <Select w="150px" mr="1rem" onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">Todos</option>
          {ministeriosNames.map(name => (
            <option value={name}>{name}</option>
          ))}
        </Select>
        : <></>}

      {ministerio === "all" ?
        <Button colorScheme="blue" variant="solid" maxW="150px" as={ReactLink} to="/create">
          <AddIcon mr="10px" /> Criar Música
        </Button>
        : <></>}
    </Flex>
  )
}

export default TableMusics