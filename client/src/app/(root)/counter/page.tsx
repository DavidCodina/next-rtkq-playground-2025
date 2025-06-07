import type { Metadata } from 'next'

import { Page, PageContainer, Title } from 'components'
import { ReduxCounter } from './components'

// https://beta.nextjs.org/docs/guides/seo
export const metadata: Metadata = {
  title: 'Counter',
  description: 'The Redux Counter Page'
}

/* ========================================================================
                                PageCounter
======================================================================== */

const PageCounter = () => {
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
          REDUX COUNTER
        </Title>

        <ReduxCounter />
      </PageContainer>
    </Page>
  )
}

export default PageCounter
