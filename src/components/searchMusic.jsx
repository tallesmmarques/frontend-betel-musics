import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Divider, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useRadio, useRadioGroup } from "@chakra-ui/react"
import { useState } from "react"
import api from "../service/api"

function SearchMusic({ isOpen, onClose, setValue }) {
  const [selected, setSelected] = useState("")
  const [search, setSearch] = useState("")
  const [loadingButton, setLoadingButton] = useState({ search: false, fill: false })
  const [musicsResult, setMusicsResult] = useState([])

  const handleSearch = () => {
    if (search !== "") {
      setLoadingButton(prev => ({ ...prev, search: true }))
      api.get("/cifra", { params: { search }, timeout: 10 * 1000 })
        .then(({ data }) => {
          setMusicsResult(data)
          setLoadingButton(prev => ({ ...prev, search: false }))
        })
    }
  }
  const handleChange = (item) => {
    setSelected(item)
  }
  const handleFill = () => {
    if (selected !== "") {
      setLoadingButton(prev => ({ ...prev, fill: true }))
      const url = new URL(selected)
      api.get("/cifra/music", { params: { path: url.pathname } })
        .then(({ data }) => {
          setLoadingButton(prev => ({ ...prev, fill: false }))
          setValue(data)
          setSelected("")
          setSearch("")
          setMusicsResult([])
          onClose()
        })
        .catch(err => console.log(err))
    }
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "searchResult",
    onChange: handleChange
  })

  const group = getRootProps()

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pesquisar por Música</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>

            <InputGroup>
              <Input autoComplete="off" name="search" placeholder="Digite o nome de uma música" value={search} onChange={({ target }) => setSearch(target.value)} />
              <InputRightElement>
                <Button onClick={handleSearch} isLoading={loadingButton.search}><SearchIcon /></Button>
              </InputRightElement>
            </InputGroup>
            {musicsResult !== [] ? (
              <Stack
                mt="20px"
                spacing={4}
                {...group}
              >
                <Divider />
                {musicsResult.map((music) => {
                  const radio = getRadioProps({ value: music.linkCifra })
                  return (
                    <RadioCard key={music.id} {...radio}>
                      {music.name} - {music.author}
                    </RadioCard>
                  )
                })}
              </Stack>
            ) : (
              <Text>Nenhum resultado</Text>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleFill} variant="solid" flex="1"
            isLoading={loadingButton.fill}
            loadingText="Preenchendo"
            spinnerPlacement="end"
            colorScheme={
              selected === "" ? "gray" : "green"
            }>{
              selected === "" ? "Selecione uma música" : "Preencher formulário"
            }</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blue.500",
          color: "white",
          borderColor: "blue.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default SearchMusic