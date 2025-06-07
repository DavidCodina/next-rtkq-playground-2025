import { Page, PageContainer, Title } from '@/components'
import { UpdateContactForm } from './components'

/* ========================================================================
                              PageUpdateContact
======================================================================== */

const PageUpdateContact = () => {
  /* ======================
          return
  ====================== */

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
          Update Contact
        </Title>

        <section className='mx-auto' style={{ maxWidth: 500 }}>
          <UpdateContactForm />
        </section>
      </PageContainer>
    </Page>
  )
}

export default PageUpdateContact
