import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  Button
} from "@chakra-ui/react"

function Dialog({ isOpen, cancelRef, onClose, header, body, action, actionText, colorScheme }) {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentralized
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>
            {body}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme={colorScheme} onClick={action} ml={3}>
              {actionText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default Dialog