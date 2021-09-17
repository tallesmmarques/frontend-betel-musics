import {
  Box,
  Text,
  Flex,
  Heading,
  Image,
  useMediaQuery,
  Divider,
} from "@chakra-ui/react"
import ListMusics from "../components/listMusics"

function Home({ musics, events, setEventMusics, fetchMusics }) {
  return (
    <Flex bg="#f3f4f5" minH="100vh" maxW="100vw" w="100%" flexDirection="column">

      <Box h="5px" bg="blue.500"></Box>

      <Box p="30px" pt="20px" bg="white" boxShadow="sm" display="flex" flexDirection="row">
        <Image display={useMediaQuery("(min-width: 400px)")[0] ? "block" : "none"} src="logo_betel.png" alt="Logo Betel" boxSize="120px" objectFit="cover" fallbackSrc="https://via.placeholder.com/120?text=Betel+Musics" />
        <Flex flexDirection="column" justify="center" ml="20px" mt="40px">
          <Text pb="5px" color="blackAlpha.500">Coletânia de Músicas</Text>
          <Heading>Betel Musics</Heading>
        </Flex>
      </Box>

      {events.map(event =>
        <ListMusics key={event.id} fetchMusics={fetchMusics} event={event} isEvent setEventMusics={setEventMusics} />
      )}

      <Divider />

      <ListMusics musics={musics} title="Todas Músicas" setEventMusics={setEventMusics} />

      {/* {useMediaQuery("(min-width: 1000px)")[0] ? (
        <TableMusics musics={musics} title="Todas Músicas" ministerio="all" />
      ) : (
        <ListMusics musics={musics} title="Todas Músicas" />
      )} */}
    </Flex>
  )
}
export default Home
