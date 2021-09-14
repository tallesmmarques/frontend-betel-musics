import {
  Flex,
  CircularProgress
} from "@chakra-ui/react"

function Loading () {
  return (
    <Flex bg="#f3f4f5" minH="100vh" align="center" justify="center">
      <CircularProgress isIndeterminate size="50px" />
    </Flex>
  )
}

export default Loading