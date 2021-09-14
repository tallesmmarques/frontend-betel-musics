import {
  Box,
  Text,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react"
import TableMusics from "../components/tableMusics"

function Home({ musics }) {

  return (
    <Flex bg="#f3f4f5" minH="100vh" flexDirection="column">

      <Box h="5px" bg="blue.500"></Box>

      <Box p="30px" pt="20px" bg="white" boxShadow="sm" display="flex" flexDirection="row">
        <Image src="logo_betel.png" alt="Logo Betel" boxSize="120px" objectFit="cover" fallbackSrc="https://via.placeholder.com/120?text=Betel+Musics" />
        <Flex flexDirection="column" justify="center" ml="20px" mt="40px">
          <Text pb="5px" color="blackAlpha.500">Coletânia de Músicas</Text>
          <Heading>Betel Musics</Heading>
        </Flex>
      </Box>

      <TableMusics musics={musics} title="Todas Músicas" ministerio="all" />
    </Flex>
  )
}
export default Home
