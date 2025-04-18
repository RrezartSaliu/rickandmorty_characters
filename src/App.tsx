
import './App.css'
import {  useQuery } from '@apollo/client'
import { Provider } from './components/ui/provider'
import { createListCollection, Grid, Checkbox, HStack, Skeleton, SkeletonCircle, Stack, Popover, Button, Text, Container, Flex, VStack, Box, Tabs, Image } from '@chakra-ui/react'
import { Select, Portal } from '@chakra-ui/react'
import { Character, DisplayCharacters } from './components/display-characters'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import client from './apollo/apollo-client'
import { getCharactersQuery } from './queries/characters'
import LanguageSwitcher from './components/language_switcher'
import { useTranslation } from 'react-i18next'



function App() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { t } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const nextPageRef = useRef(1);
  const [ filters, setFilters ]= useState({
    status: {
      Alive: false,
      Dead: false,
      unknown: false
    },
    species: {
      Human: false,
      Alien: false
    }
  })
  const [ sortTag, setSortTag ]= useState("default")

  const { loading, error, data, fetchMore } = useQuery(getCharactersQuery(), {
    variables: { page: 1 },
    onCompleted: (data) => {
      if (data.characters.results) {
        setAllCharacters(data.characters.results)
        setHasMore(data.characters.info.next !== null)
        nextPageRef.current = 2
      }
    }
  });


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          loadMoreCharacters();
        }
      },
      { threshold: 0.5 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, hasMore]);

  const loadMoreCharacters = useCallback(async () => {
    if (loading || !hasMore) return;

    await fetchMore({
      variables: {
        page: nextPageRef.current,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        const existingIds = new Set(prev.characters.results.map((c:Character) => c.id));
        const newCharacters = fetchMoreResult.characters.results.filter(
          (character: Character) => !existingIds.has(character.id)
        );

        if (newCharacters.length === 0) {
          setHasMore(false);
          return prev;
        }

        const mergedCharacters = {
          characters: {
            ...fetchMoreResult.characters,
            results: [...prev.characters.results, ...newCharacters],
          },
        };

        setAllCharacters(mergedCharacters.characters.results);
        setHasMore(fetchMoreResult.characters.info.next !== null);
        nextPageRef.current += 1;

        return mergedCharacters;
      },
    });
  }, [loading, hasMore, fetchMore]);

  const sortCharacters = (message: string) => {
    setSortTag(message)
  }

  const fetchAllCharacters = async (
    page: number = 1,
    accumulatedCharacters: any[] = []
  ): Promise<any[]> => {
    try {
      const { data } = await client.query({
        query: getCharactersQuery(),
        variables: { page }
      });
  
      const newCharacters = [...accumulatedCharacters, ...data.characters.results];
      
      if (data.characters.info.next) {
        return fetchAllCharacters(page + 1, newCharacters);
      }
      
      return newCharacters;
    } catch (err) {
      console.error("Error fetching characters:", err);
      return accumulatedCharacters;
    }
  };

  const filteredCharacters = useMemo(() => {
    if (!allCharacters.length) return [];
    
    return allCharacters.filter(character => {
      const statusFilters = Object.entries(filters.status)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      const speciesFilters = Object.entries(filters.species)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      return (
        (statusFilters.length === 0 || statusFilters.includes(character.status)) &&
        (speciesFilters.length === 0 || speciesFilters.includes(character.species))
      );
    });
  }, [allCharacters, filters]);

  const sortMethods = createListCollection({
    items: [
      {label: t('default'), value: 'default'},
      {label: t('name'), value: 'name'},
      {label: t('origin'), value: 'origin'}
    ]
  })

  const sortedCharacters = useMemo(() => {
    if (!filteredCharacters.length) return [];
    
    const characters = [...filteredCharacters];
    switch (sortTag) {
      case "name":
        return characters.sort((a, b) => a.name.localeCompare(b.name));
      case "origin":
        return characters.sort((a, b) => a.origin.name.localeCompare(b.origin.name));
      default:
        return characters;
    }
  }, [filteredCharacters, sortTag]);


  return (
    <div className='fixed-background'>
      <div className='content-overlay'>
      <Provider>
          <VStack align='stretch' alignItems='center'>
          <LanguageSwitcher></LanguageSwitcher>
          <h1 color='white'>{ t('header') }</h1>
          <br/>
          <Flex gap='20'>
          <Select.Root variant='subtle' collection={sortMethods} size="sm" width="320px">
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t('sort_placeholder')} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />  
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {sortMethods.items.map((method) => (
                    <Select.Item onClick={()=>sortCharacters(method.value)} item={method} key={method.value}>
                      {method.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Popover.Root>
            <Popover.Trigger asChild>
              <HStack wrap='wrap'>
              <Button variant='solid' colorPalette='teal'>
                Filter
              </Button>
              </HStack>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Body>
                    <Popover.Title fontWeight="medium">Status:</Popover.Title>
                    {Object.entries(filters.status).map(([status, checked]) => (
                      <>
                      <Checkbox.Root
                        key={status}
                        checked={checked}
                        padding='3'
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          status: { ...prev.status, [status]: !checked }
                        }))}
                      >
                        <Checkbox.HiddenInput/>
                        <Checkbox.Control/>
                        <Checkbox.Label>{t(status)}</Checkbox.Label>
                      </Checkbox.Root>
                      <br/>
                      </>
                    ))}
                    <Popover.Title fontWeight='medium'>{t('species')}: </Popover.Title>
                    {Object.entries(filters.species).map(([species, checked]) => (
                      <>
                      <Checkbox.Root
                        key={species}
                        checked={checked}
                        padding='3'
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          species: { ...prev.species, [species]: !checked }
                        }))}
                        >
                        <Checkbox.HiddenInput/>
                        <Checkbox.Control/>
                        <Checkbox.Label>{t(species)}</Checkbox.Label>
                      </Checkbox.Root>
                      <br/>
                      </>
                    ))}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
          </Flex>
          
          <br/>
          <Grid templateColumns="repeat(3, 3fr)" gap='20' >
            {loading ? (
              <HStack gap="5">
                <SkeletonCircle size="12" />
                <Stack flex="1">
                  <Skeleton height="5" />
                  <Skeleton height="5" width="80%" />
                </Stack>
              </HStack>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                <DisplayCharacters characters={sortedCharacters} />
                  <div 
                  ref={sentinelRef}
                  style={{ height: '20px' }}
                  data-testid="scroll-sentinel"
                />
                {loading && currentPage > 1 && <p>
                  <HStack gap="5">
                    <SkeletonCircle size="12" />
                    <Stack flex="1">
                      <Skeleton height="5" />
                      <Skeleton height="5" width="80%" />
                    </Stack>
                  </HStack>
                  </p>}
                {!hasMore && <p>All characters loaded</p>}
              </>
            )}
          </Grid>
          </VStack>
      </Provider>
      </div>
      </div>
  )
}

export default App
