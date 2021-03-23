import React, { useEffect, useState } from 'react';
import useSwr from 'swr';
import { Status, TriggerResult } from './interface';
import 'semantic-ui-css/semantic.min.css';
import { Button, Container, Divider, Grid, Header, Label, List, Loader, Progress } from 'semantic-ui-react';

function App() {
  const fetcher = async (url: string) => await (await fetch(url)).json();
  const { data: status, revalidate } = useSwr<Status, any>(`/valg/api/status`, fetcher, {
    refreshInterval: 1000,
  });

  const trigger = async (url: string): Promise<TriggerResult> => {
    const resp = await fetch(url, {
      method: 'POST',
    });
    return await resp.json();
  }
  const triggerStart = async () => trigger('/valg/api/start').then(revalidate);
  const triggerStop = async () => trigger('/valg/api/stop').then(revalidate);
  const triggerFetch = async () => trigger('/valg/api/fetch').then(revalidate);

  const style = {
    h1: {
      marginTop: '1em',
    },
  };

  return (
    <div>
      <Header as='h1' textAlign='center' style={style.h1}>valg?</Header>
      <Container textAlign='center'>
        <Button color='green' onClick={triggerStart}>START</Button>
        <Button color='red' onClick={triggerStop}>STOP</Button>
        <Button color='blue' onClick={triggerFetch}>Reload</Button>

        <Divider />
        <Container>
          <Header>
            status
          </Header>
          {
            status ? <>
              Server {
                status?.pid ? <Label color='green'>UP</Label> : <Label color='grey'>DOWN</Label>
              }
              {
                status.pid ?
                  <div>
                    <Divider hidden />
                    <Grid columns={2} divided>
                      <Grid.Row>
                        <Grid.Column>
                          <Progress label='CPU' value={status.cpu?.toFixed()} total='100' progress='percent' />
                        </Grid.Column>
                        <Grid.Column>
                          <Progress label='MEM' value={status.mem?.toFixed()} total='100' progress='percent' />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                  : <></>
              }
            </> : <Loader>loading</Loader>
          }
        </Container>
      </Container>
    </div>
  );
}

export default App;
