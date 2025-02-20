import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // Importa o locale desejado
import customParseFormat from 'dayjs/plugin/customParseFormat' // Exemplo de plugin

dayjs.locale('pt-br') // Define o locale
dayjs.extend(customParseFormat) // Adiciona o plugin

export default dayjs
