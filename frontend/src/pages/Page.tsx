import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { Alert, Box, Stack } from '@mui/material';

import Header from 'components/organisms/header';

import { useAuth } from 'hooks/auth';

import { projectSettingsState } from 'state/project';
import { userEnvState } from 'state/user';

type Props = {
  children: JSX.Element;
};

const Page = ({ children }: Props) => {
  const {
    isProjectMember,
    authenticating,
    isAuthenticated,
    accessToken,
    role
  } = useAuth();
  const pSettings = useRecoilValue(projectSettingsState);
  const userEnv = useRecoilValue(userEnvState);
  const navigate = useNavigate();

  const isPrivate = pSettings && !pSettings.project?.public;

  useEffect(() => {
    if (pSettings?.project?.user_env) {
      for (const key of pSettings.project?.user_env || []) {
        if (!userEnv[key]) navigate('/env');
      }
    }
    if (isPrivate && !isAuthenticated && !authenticating) {
      navigate('/login');
    }
  }, [pSettings, isAuthenticated, authenticating, userEnv]);

  if (!pSettings || (isPrivate && (!accessToken || !role))) {
    return null;
  }

  const notAllowed = isPrivate && role && !isProjectMember;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Header />

      <Stack
        alignItems="center"
        direction="row"
        className="image-banner"
        alignContent="center"
      >
        <Stack
          alignItems="center"
          direction="column"
          style={{ margin: '0 auto' }}
        >
          <h1>Data & Analytics Self-Assessment</h1>
          <h2>
            Powered by Onepoint's Data & Analytics Body of Knowledge and ChatGPT
          </h2>
        </Stack>
      </Stack>

      {notAllowed ? (
        <Alert severity="error">You are not part of this project.</Alert>
      ) : (
        children
      )}
    </Box>
  );
};

export default Page;
