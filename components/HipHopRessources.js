// Component file
import React, { useEffect, useState } from 'react';
import styles from '../styles/Ressources.module.css';
import { supabase } from '../supabaseClient';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import { Accordion as AccordionMantine } from '@mantine/core'

import 'react-accessible-accordion/dist/fancy-example.css';


function HipHopRessources() {

  const { data, error, isLoading } = useQuery(
    supabase.from('resources').select('*')
  );

  const [defaultValue, setDefaultValue] = useState(null);
  const [groupedResources, setGroupedResources] = useState({});

  useEffect(() => {
    if (data) {
      const resources = data.reduce((acc, resource) => {
        if (!acc[resource.category]) {
          acc[resource.category] = {};
        }
        if (!acc[resource.category][resource.subCategory]) {
          acc[resource.category][resource.subCategory] = [];
        }
        acc[resource.category][resource.subCategory].push(resource);
        return acc;
      }, {});

      setGroupedResources(resources);

      // Set default value to the first category
      if (Object.keys(resources).length > 0) {
        setDefaultValue(Object.keys(resources)[0]);
      }
    }
  }, [data]);

  // useEffect(() => {
  //   // Set default value to the first category
  //   if (Object.keys(groupedResources).length > 0) {
  //     setDefaultValue(Object.keys(groupedResources)[0]);
  //   }
  // }, [groupedResources]);

  const SubCategories = ({ subcategories }) => {

    const displayRessource = (resource) => {

      return (
        <li key={resource.id} className={styles['resource-item']}>
          <a href={resource.url}>{resource.name || ''}</a>
          <p>{resource.description || ''}</p>
        </li>
      )
    }
    return <>
      <AccordionMantine defaultValue={'null'}>
        <For each="entry" of={Object.entries(subcategories)}>
          <AccordionMantine.Item value={entry[0] ? entry[0] : "Websites/ Blogs"} key={entry[0]} className={styles['subcategories-container']}>
            <If condition={!Object.keys(subcategories).includes('null')}>
              <AccordionMantine.Control>
                <h3 className={styles.subCategory}>{entry[0]}</h3>
              </AccordionMantine.Control>
            </If>
            <AccordionMantine.Panel>
              <ul className={styles['resources-container']}>
                <For each="resource" of={entry[1]}>
                  {displayRessource(resource)}
                </For>
              </ul>
            </AccordionMantine.Panel>
          </AccordionMantine.Item>
        </For>
      </AccordionMantine>
    </>
  };


  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <head>
        <title>Hip Hop Resources</title>
        <meta name="description" content="A collection of resources for keeping in touch and exploring hip hop culture" />
        <meta name="keywords" content="hip hop resources, underground hip hop, hip hop channels, hip hop music promotion, hip hop interviews, rap battles, street culture, hip hop lifestyle, album reviews, music production, hip hop culture preservation, classic hip hop, indie/underground hip hop, hip hop news and updates" />
        <meta property="og:title" content="Hip Hop Resources" />
        <meta property="og:description" content="A collection of resources for keeping in touch and exploring hip hop culture." />
        <meta property="og:type" content="website" />
      </head>
      <div className="hip-hop-resources">
        <Accordion
          allowZeroExpanded
          preExpanded={[defaultValue]}
          role="tablist"
          aria-multiselectable="true"
        >
          {Object.entries(groupedResources).map(([category, sub]) => {
            return (
              <AccordionItem key={category} uuid={category === "Websites/ Blogs" ? "websiteBlogs" : category} role="presentation">
                <AccordionItemHeading role="tab">
                  <AccordionItemButton
                    role="tab"
                    id={`${category}-tab`}
                    aria-controls={`${category}-panel`}
                    aria-selected={defaultValue === category}
                  >
                    {category}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  role="tabpanel"
                  id={`${category}-panel`}
                  aria-labelledby={`${category}-tab`}
                  hidden={defaultValue !== category}
                >
                  <SubCategories subcategories={sub} />
                </AccordionItemPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
}

export default HipHopRessources;

