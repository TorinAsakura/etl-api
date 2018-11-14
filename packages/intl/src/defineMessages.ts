interface MessageDescriptor {
  id: string
  description?: string
  defaultMessage?: string
}

interface Messages {
  [key: string]: MessageDescriptor
}

interface MessagesResult {
  [key: string]: string
}

export const defineMessages = (messageDescriptors: Messages): MessagesResult =>
  Object.keys(messageDescriptors).reduce((result, key) => ({
    ...result,
    [key]: messageDescriptors[key].id,
  }), {})
