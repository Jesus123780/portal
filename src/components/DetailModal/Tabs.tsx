import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Comment, Feed, Public, AttachFile, Person } from '@mui/icons-material';
import GeneralInformation from './GeneralInformation';
import CommentSection from './CommentSection';
import AttachFileComponent from './AttachFile';
import Map from './MapComponent';
import { CardContent, Divider, styled } from '@mui/material';
import Loader from '../Loader';
import { bacFetch } from '@/utils/service_config';
import ClientInformation from './ClientInformation';

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

export default function BasicTabs({
  deliveryId,
  handleClose,
  fetchData,
  setHeaderValues,
  roleCurrent,
  editEnabled
}) {
  const [value, setValue] = React.useState(0);
  const [comments, setComments] = React.useState([]);
  const [generalInformation, setGeneralInformation] = React.useState([]);
  const [images, setimages] = React.useState([]);
  const [loading, setloading] = React.useState(true);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const deliveryFetch = React.useCallback(async (sp, deliveryId) => {
    // TODO: no api
    const res = await bacFetch(`/api/connection/${sp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${deliveryId}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  React.useEffect(() => {
    const fetch = async () => {
      const resultGeneralInfo = deliveryFetch(
        'GetLoadDataByDeliveryId',
        deliveryId
      );
      const resultComments = deliveryFetch(
        'GetLOGBinnacleByDeliveryId',
        deliveryId
      );
      const resultImages = deliveryFetch('GetMSTImagesNoData', deliveryId);
      setComments(await resultComments);
      const generalInfo = await resultGeneralInfo;
      setHeaderValues(
        generalInfo[0].owner_name,
        generalInfo[0].cif,
        generalInfo[0].id
      );
      setGeneralInformation(generalInfo);
      setimages(await resultImages);
      setloading(false);
    };

    fetch();
  }, []);

  const getComments = async () => {
    const resultComments = deliveryFetch(
      'GetLOGBinnacleByDeliveryId',
      deliveryId
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
      <TabsContainerWrapper sx={{position: 'sticky', top: 0}}>
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
          <Tab
            icon={<AttachFile />}
            iconPosition="start"
            label={'Imágenes Adjuntas'}
            value={2}
          />
          <Tab
            icon={<Public />}
            iconPosition="start"
            label={'Geolocalización'}
            value={3}
            style={{
              display:
                generalInformation[0]?.latitude === null ? 'none' : 'flex'
            }}
          />
          <Tab
            icon={<Person />}
            iconPosition="start"
            label={'Datos del Cliente'}
            value={4}
            style={{
              display: roleCurrent === 'rol_1' ? 'flex' : 'none'
            }}
          />
        </Tabs>
      </TabsContainerWrapper>
      <TabPanel value={value} index={0}>
        <Box style={{ minHeight: '500px' }}>
          <GeneralInformation
            generalInformation={generalInformation[0]}
            deliveryId={deliveryId}
            handleClose={handleClose}
            fetchData={fetchData}
            roleCurrent={roleCurrent}
            editEnabled={editEnabled}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box style={{ minHeight: '500px' }}>
          <CommentSection comments={comments} deliveryId={deliveryId} getComments={getComments} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box style={{ minHeight: '500px' }}>
          <AttachFileComponent images={images} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box style={{ minHeight: '500px' }}>
          <Map
            latitude={generalInformation[0]?.latitude}
            longitude={generalInformation[0]?.longitude}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Box style={{ minHeight: '500px' }}>
          <ClientInformation
            clientInformation={generalInformation[0]}
            handleClose={handleClose}
            fetchData={fetchData}
          />
        </Box>
      </TabPanel>
      <Divider />
    </Box>
  );
}
