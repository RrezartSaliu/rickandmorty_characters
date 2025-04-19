import { CardRoot, Card, Text, Box, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import aliveIcon from '../assets/alive_icon.png'
import deadIcon from '../assets/dead_icon.png'
import unknownIcon from '../assets/unknown_icon.png'


export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: {
      name: string;
    };
  }
  
  interface DisplayCharactersProps {
    characters: Character[];
  }

  export const DisplayCharacters = ({ characters }: DisplayCharactersProps) => {
    const { t } = useTranslation()

    return characters.map(({ id, name, status, species, gender, origin }) => (
      <div key={id}>
        <CardRoot
            position="relative"
            color="white"
            backgroundColor='transparent'
            _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bg: 'rgba(0, 0, 0, 0.7)',
                zIndex: 0
            }}
            >
                <Box position="relative" zIndex={1}>
          <Card.Header fontSize='2xl'>{name}</Card.Header>
          <Card.Body>
            <Text>
              <p >Status: {t(status)} <Image src={status==="Alive"?aliveIcon:status==="Dead"?deadIcon:unknownIcon} boxSize='7'></Image></p>
              <p>{t('species')}: {t(species)}{(t(species)==="Ausländer") && gender === "Female"?"in":""}</p>
              <p>{t('gender')}: {t(gender)}</p>
              <p>{(t('origin').charAt(0).toUpperCase() + t('origin').slice(1).toLowerCase())}: {t(origin.name)}</p>
            </Text>
          </Card.Body>
          </Box>
        </CardRoot>
      </div>
    ));
  };