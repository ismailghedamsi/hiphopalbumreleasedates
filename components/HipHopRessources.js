// Component file
import React, { useEffect, useState } from 'react';
import styles from '../styles/Ressources.module.css';
import { supabase } from '../supabaseClient';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { Accordion } from '@mantine/core';
import Collapsible from 'react-collapsible';

const HipHopRessources = () => {
  const [isOpen, setOpened] = useState(false)



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

  const [collapseStatus, setCollapseStatus] = useState(
    Object.keys(groupedResources).map((category) => ({
      category,
      isOpen: false,
    }))
  );

  const handleTriggerClick = (category) => {
    setCollapseStatus((prevStatus) =>
      prevStatus.map((status) =>
        status.category === category
          ? { ...status, isOpen: !status.isOpen }
          : status
      )
    );
  };

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
      <Accordion defaultValue={'null'}>
        <For each="entry" of={Object.entries(subcategories)}>
          <Accordion.Item value={entry[0] ? entry[0] : "Websites/ Blogs"} key={entry[0]} className={styles['subcategories-container']}>
            <If condition={!Object.keys(subcategories).includes('null')}>
              <Accordion.Control>
                <h3 className={styles.subCategory}>{entry[0]}</h3>
              </Accordion.Control>
            </If>
            <Accordion.Panel>
              <ul className={styles['resources-container']}>
                <For each="resource" of={entry[1]}>
                  {displayRessource(resource)}
                </For>
              </ul>
            </Accordion.Panel>
          </Accordion.Item>
        </For>
      </Accordion>
    </>
  };



  return (
    Object.entries(groupedResources).map(([category, subcategories]) => {

      return (
        <div>
          <Collapsible transitionTime={400}
            trigger={
              <div
                onClick={() => handleTriggerClick(category)}
                style={{
                  marginBottom: "5px",
                  height: "50px",
                  display: "flex",
                  backgroundColor: "lightblue",
                  alignItems: "center"
                }}
              >
                <span style={{ flex: 1 }}>{category}</span>
                <span style={{ paddingRight: "20px" }}>
                  {collapseStatus.find((s) => s.category === category)?.isOpen
                    ? "-"
                    : "+"}
                </span>
              </div>
            }
          >
            {/* <div className={styles.category}>{category}</div> */}
            <SubCategories subcategories={subcategories} />
          </Collapsible>


          {error && <p>{error.message}</p>}
          {isLoading && <p>Loading...</p>}
        </div>
      )
    }
    )
  )
}

export default HipHopRessources;

