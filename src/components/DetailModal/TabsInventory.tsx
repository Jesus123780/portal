import * as React from 'react';
import { Comment, Feed } from '@mui/icons-material';
import { CardContent, Divider, styled } from '@mui/material';
import { bacFetch } from '@/utils/service_config';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InventoryInformation from './InventoryInformation';
import CommentSection from './CommentSectionInventory';
import Loader from '../Loader';

const TabsContainerWrapper = styled(CardContent)(
  ({}) => `
      background-color: #fafafa;
      z-index: 10;
      border-bottom: solid 1px #ccc;
`
);
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 3, paddingTop: 1 }}>{children}</Box>}
    </div>
  );
}

export default function TabsInventory({
  inventoryId,
  handleClose,
  fetchData,
  setHeaderValues,
  editEnabled
}) {
  const [value, setValue] = React.useState(0);
  const [comments, setComments] = React.useState([]);
  const [inventoryInformation, setInventoryInformation] = React.useState([]);
  const [loading, setloading] = React.useState(true);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const deliveryFetch = React.useCallback(async (sp, inventoryId) => {
    // TODO: no api
    const res = await bacFetch(`/api/connection/${sp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${inventoryId}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  React.useEffect(() => {
    const fetch = async () => {
      const resultGeneralInfo = deliveryFetch(
        'GetLoadDataByInventoryId',
        inventoryId
      );
      const resultComments = deliveryFetch(
        'GetLOGByInventoryId',
        inventoryId
      );
      setComments(await resultComments);
      const generalInfo = await resultGeneralInfo;
      setHeaderValues(
        generalInfo[0].owner_name,
        generalInfo[0].cif,
        generalInfo[0].id
      );
      setInventoryInformation(generalInfo);
      setloading(false);
    };

    fetch();
  }, []);

  const getComments = async () => {
    const resultComments = deliveryFetch(
      'GetLOGByInventoryId',
      inventoryId
    );
    setComments(await resultComments);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 20, minHeight: '500px' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Divider />
      <TabsContainerWrapper sx={{ position: 'sticky', top: 0 }}>
        <Tabs
          onChange={handleChange}
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<Feed />}
            iconPosition="start"
            label={'Información General'}
            value={0}
          />
          <Tab
            icon={<Comment />}
            iconPosition="start"
            label={'Comentarios del Proceso'}
            value={1}
          />
        </Tabs>
      </TabsContainerWrapper>
      <TabPanel value={value} index={0}>
        <Box style={{ minHeight: '500px' }}>
          <InventoryInformation
            inventoryInformation={inventoryInformation[0]}
            inventoryId={inventoryId}
            handleClose={handleClose}
            fetchData={fetchData}
            editEnabled={editEnabled}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box style={{ minHeight: '500px' }}>
          <CommentSection
            comments={comments}
            deliveryId={inventoryId}
            getComments={getComments}
          />
        </Box>
      </TabPanel>
      <Divider />
    </Box>
  );
}
