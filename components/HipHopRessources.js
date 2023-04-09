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
  return (
    <Accordion>
      {Object.entries(groupedResources).map(([category, subcategories]) => {
        console.log("subcat ", Object.keys(subcategories).includes('null'))
        return <Accordion.Item value={category} key={category}>
          <Accordion.Control className={styles.category}>{category}</Accordion.Control>
          <Accordion.Panel>
            {Object.entries(subcategories).map(([subCategory, resources]) => (
              <div key={`${category}-${subCategory}`} className={styles['subcategories-container']}>
                {!Object.keys(subcategories).includes('null') && <h3 className={styles.subCategory}>{subCategory}</h3>}
                <ul className={styles['resources-container']}>
                  {resources.map(resource => (
                    <li key={resource.id} className={styles['resource-item']}>
                      <a href={resource.url}>{resource.name || ''}</a>
                      <p>{resource.description || ''}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      })}
      {error && <p>{error.message}</p>}
      {isLoading && <p>Loading...</p>}
    </Accordion>
  );

}

export default HipHopRessources;

