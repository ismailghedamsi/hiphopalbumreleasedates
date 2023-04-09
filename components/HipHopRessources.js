// Component file
import React, { useEffect, useState } from 'react';
import styles from '../styles/Ressources.module.css';
import { supabase } from '../supabaseClient';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { Accordion } from '@mantine/core';


const HipHopRessources = () => {
  const { data, error, isLoading } = useQuery(
    supabase.from('resources').select('*')
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Group resources by category and subcategory
  let groupedResources = {};

  if (data) {
    groupedResources = data.reduce((acc, resource) => {
      if (!acc[resource.category]) {
        acc[resource.category] = {};
      }
      if (!acc[resource.category][resource.subCategory]) {
        acc[resource.category][resource.subCategory] = [];
      }
      acc[resource.category][resource.subCategory].push(resource);
      return acc;
    }, {});
  }

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
    <For each="entry" of={Object.entries(subcategories)}>
      <div key={entry[0]} className={styles['subcategories-container']}>
        <If condition={!Object.keys(subcategories).includes('null')}>
          <h3 className={styles.subCategory}>{entry[0]}</h3>
        </If>
        <ul className={styles['resources-container']}>
          <For each="resource" of={entry[1]}>
          {displayRessource(resource)}
          </For>
        </ul>
      </div>
    </For>
  </>
};

  return (
    <Accordion>
      {Object.entries(groupedResources).map(([category, subcategories]) => {
        console.log("subcat ", Object.keys(subcategories).includes('null'))
        return <Accordion.Item value={category} key={category}>
          <Accordion.Control className={styles.category}>{category}</Accordion.Control>
          <Accordion.Panel>
            <SubCategories subcategories={subcategories} />
          </Accordion.Panel>
        </Accordion.Item>
      })}
      {error && <p>{error.message}</p>}
      {isLoading && <p>Loading...</p>}
    </Accordion>
  );

}

export default HipHopRessources;

