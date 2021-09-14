import {Link as ReactLink} from "react-router-dom"
import {
  Box,
  Text,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Button,
  Link,
  Image,
} from "@chakra-ui/react"
import {
  AddIcon, 
  ExternalLinkIcon
} from "@chakra-ui/icons"

function Home ({musics}) {

  return (
    <Flex bg="#f3f4f5" minH="100vh" flexDirection="column">

      <Box h="5px" bg="blue.500"></Box>

      <Box p="30px" pt="20px" bg="white" boxShadow="sm" display="flex" flexDirection="row">
        <Image src="logo_betel.png" alt="Logo Betel" boxSize="120px" objectFit="cover" />
        <Flex flexDirection="column" justify="center" ml="20px" mt="40px">
          <Text pb="5px" color="blackAlpha.500">Coletânia de Músicas</Text>
          <Heading>Betel Musics</Heading>
        </Flex>
      </Box>

      <Box p="50px" px="100px">
        <Flex pb="20px" align="center" >
          <Heading flex="1" size="md">Todas Músicas</Heading>
          <Button colorScheme="blue" variant="solid" maxW="150px" as={ReactLink} to="/create"><AddIcon mr="10px"/> Criar Música</Button>
        </Flex>
        <Table variant="simple" bg="white" boxShadow="sm">
          <Thead>
            <Tr>
              {["Música", "Artista", "Gênero", "Alber", "Lucimeire", "Adolescentes", "CifraClub", "Youtube"].map(field => (
                <Th key={field} pt="15px" fontSize="11px" fontWeight="bold" isTruncated>{field}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {musics.map(music => {
              const tomAlber = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-alber")?.tom
              const tomLucimeire = music.ministeriosInfo.find(mi => mi.ministerio === "sdn-lucimeire")?.tom
              const tomAdolescentes = music.ministeriosInfo.find(mi => mi.ministerio === "adolescentes")?.tom
              return (
                <Tr key={music.id}>
                  <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.name}</Th>
                  <Th textTransform="none" fontSize="14px" minW="200px" fontWeight="light" isTruncated>{music.author}</Th>
                  <Th textTransform="none" fontSize="14px" minW="100px" bg="gray.50" fontWeight="light" isTruncated>{music.gender}</Th>
                  {[tomAlber, tomLucimeire, tomAdolescentes].map((field, index) => (
                    <Th key={index} textTransform="none" maxW="50px" fontSize="14px" fontWeight="light">{field}</Th>
                  ))}
                  {[music.linkCifra, music.linkYoutube].map((field, index) => (
                    <Th key={index} textTransform="none" fontSize="14px" fontWeight="light" textOverflow="ellipsis">
                      <Link href={field} isExternal>Acessar Link <ExternalLinkIcon mx="2px" mb="2px"/></Link>
                    </Th>
                  ))}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>
    </Flex>
    )
}
export default Home