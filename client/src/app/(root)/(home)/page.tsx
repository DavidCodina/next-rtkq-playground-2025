import * as React from 'react'
import { Page, PageContainer, Title } from '@/components'

/* ========================================================================

======================================================================== */

const Home = async () => {
  return (
    <Page>
      <PageContainer>
        <Title
          as='h2'
          style={{
            marginBottom: 50,
            textAlign: 'center'
          }}
        >
          Home
        </Title>
      </PageContainer>
    </Page>
  )
}

export default Home
