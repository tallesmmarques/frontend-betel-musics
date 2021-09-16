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
} from "@chakra-ui/react"
import {
  AddIcon, EditIcon, ExternalLinkIcon
} from "@chakra-ui/icons"
import { useState } from "react"

function TableMusics({ musics, title }) {
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <Box py="30px">
      <Header
        title={title}
        search={search}
        handleSearch={handleSearch}
      />

      {/* <Heading p="20px" size="lg" textTransform="capitalize">{title}</Heading> */}
      <Accordion allowToggle mx="0px" bg="white">
        {musics.map((music, index) => {
          const alber = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-alber")
          const lucymary = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-lucy")
          const adolescentes = music.ministeriosInfo.find(mi => mi.ministerio === "adolescentes")
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
                    {["Alber", "Lucy Mary", "Adolescentes"].map(head => (
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
                    {[alber, lucymary, adolescentes].map(value => (
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

function Header({ title, search, handleSearch }) {
  return (
    <VStack spacing={5} mb="10px" p="20px" align="left" >
      <Button colorScheme="blue" variant="solid" w="100%" as={ReactLink} to="/create"><AddIcon mr="10px" /> Criar Música</Button>

      {/* <InputGroup>
        <InputRightElement children={<SearchIcon />} />
        <Input value={search} onChange={handleSearch} borderColor="blue.500" border="1px" variant="filled" bg="white" placeholder="Pesquisar por música ou artista" />
      </InputGroup> */}
    </VStack>
  )
}

export default TableMusics
