import {
  Box,
  Card,
  Typography,
  TextField,
  Avatar,
  Divider,
  Button,
  styled,
  CircularProgress
} from '@mui/material';
import locale from 'date-fns/locale/es';
import { formatDistance } from 'date-fns';
import Scrollbar from 'src/components/Scrollbar';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { Message, Settings } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useSelector } from '@/store';
import { bacFetch } from '@/utils/service_config';

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
            height: 40px !important;
            margin: 0 ${theme.spacing(2)};
            align-self: center;
    `
);

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
          background: ${theme.colors.secondary.main};
          color: ${theme.palette.primary.contrastText};
          padding: ${theme.spacing(2)};
          border-radius: ${theme.general.borderRadiusXl};
          border-top-right-radius: ${theme.general.borderRadius};
          display: inline-flex;
          width: 100%;
    `
);

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
          background: ${theme.colors.alpha.black[10]};
          color: ${theme.colors.alpha.black[100]};
          padding: ${theme.spacing(2)};
          border-radius: ${theme.general.borderRadiusXl};
          border-top-left-radius: ${theme.general.borderRadius};
          display: inline-flex;
          width: 100%;
    `
);

function CommentSection({ comments, deliveryId, getComments }) {
  const [comment, setComment] = useState('');
  const [loading, setloading] = useState(false);
  const { user } = useSelector((state) => state.permissions);
  
  const sp_SaveSingleLogBinnacle = useCallback(
    async (deliveryId, user, message) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/SaveSingleLogBinnacle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${deliveryId}','COMMENTS','${user}',0,0,'${message}'`
        })
      });
      return res.status;
    },
    []
  );

  const saveComment = async () => {
    setloading(true);
    const result = await sp_SaveSingleLogBinnacle(
      deliveryId,
      user.userName,
      comment
    );
    if (result === 200) {
      await getComments();
      setComment('');
      setloading(false);
    }
  };

  const RightMessage = ({ comment }) => {
    return (
      <Box
        display="flex"
        alignItems="flex-center"
        justifyContent="flex-end"
        py={1}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40
          }}
        >
          {comment.type === 'COMMENTS' ? <Message /> : <Settings />}
        </Avatar>

        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          justifyContent="flex-end"
          ml={2}
          mr={2}
        >
          <CardWrapperPrimary>
            {comment.type === 'COMMENTS'
              ? comment.message
              : `Ha cambiado estado de ${comment.from_value} a ${comment.to_value}`}
          </CardWrapperPrimary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {formatDistance(new Date(comment.create_date), Date.now(), {
              addSuffix: true,
              locale
            })}{' '}
            {dayjs(comment.create_date).format('DD/MM/YYYY')}
            <ScheduleTwoToneIcon
              sx={{
                mr: 0.5,
                ml: 1
              }}
              fontSize="small"
            />
            <strong>{comment.create_by}</strong>
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            width: 50,
            height: 50
          }}
        />
      </Box>
    );
  };

  const LeftMessage = ({ comment }) => {
    return (
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        py={1}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 50,
            height: 50
          }}
        />
        <Box
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="flex-start"
          ml={2}
          mr={2}
        >
          <CardWrapperSecondary>
            {comment.type === 'COMMENTS'
              ? comment.message
              : `Ha cambiado estado de ${comment.from_value} a ${comment.to_value}`}
          </CardWrapperSecondary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <strong>{comment.create_by}</strong>
            <ScheduleTwoToneIcon
              sx={{
                mr: 0.5,
                ml: 1
              }}
              fontSize="small"
            />
            {dayjs(comment.create_date).format('DD/MM/YYYY')}{' '}
            {formatDistance(new Date(comment.create_date), Date.now(), {
              addSuffix: true,
              locale
            })}
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40
          }}
        >
          {comment.type === 'COMMENTS' ? <Message /> : <Settings />}
        </Avatar>
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          height: 410
        }}
      >
        <Scrollbar>
          <Box px={2}>
            {comments.map((comment) => {
              return (
                <div key={comment.bin_id}>
                  {comment.create_by === user.userName ? (
                    <RightMessage comment={comment} />
                  ) : (
                    <LeftMessage comment={comment} />
                  )}
                </div>
              );
            })}
          </Box>
        </Scrollbar>
      </Box>
      <Divider />
      <Box p={2} display="flex" alignItems="center">
        <Avatar />
        <DividerWrapper orientation="vertical" flexItem />
        <Box
          sx={{
            flex: 1,
            mr: 2
          }}
        >
          <TextField
            hiddenLabel
            fullWidth
            placeholder={'Escribe aquí tu comentario (MAX 450)'}
            value={comment}
            inputProps={{maxLength:450}}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </Box>
        <DividerWrapper orientation="vertical" flexItem />
        <Button
          variant="contained"
          onClick={saveComment}
          startIcon={
            loading ? <CircularProgress size="1rem" /> : <SendTwoToneIcon />
          }
          disabled={ loading ||comment.length==0}
        >
          {'Comentar'}
        </Button>
        
      </Box>
    </>
  );
}

export default CommentSection;
