import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tabs, Image } from "@chakra-ui/react";
import englishFlag from '../assets/english.png'
import germanFlag from '../assets/german.png'

const LanguageSwitcher = () => {
    const { i18n } = useTranslation()
    const [langChange, setLangChange] = useState('en')

    useEffect(()=>{
        i18n.changeLanguage(langChange)
    },[langChange])

    return(
        <Box
            position="fixed"
            bottom="4" 
            left="4" 
            zIndex="sticky"
          >
            <Tabs.Root variant="enclosed" fitted defaultValue="tab-1" onValueChange={()=>setLangChange(langChange==="en"?"de":"en")}>
              <Tabs.List backgroundColor='green.fg'>
                <Tabs.Trigger value="tab-1" backgroundColor={langChange==='en'?'green.200':'transparent'}>
                  <Image 
                    src={englishFlag}
                    boxSize="30px"
                    objectFit="cover"
                    alt="English"
                  />
                </Tabs.Trigger>
                <Tabs.Trigger value="tab-2" backgroundColor={langChange==='de'?'green.200':'transparent'}>
                  <Image 
                    src={germanFlag} 
                    boxSize="30px"
                    objectFit="cover"
                    alt="German"
                  />
                </Tabs.Trigger>
                <Tabs.Indicator backgroundColor="green.200" rounded='l3'></Tabs.Indicator>
              </Tabs.List>
            </Tabs.Root>
          </Box>
    )
}

export default LanguageSwitcher