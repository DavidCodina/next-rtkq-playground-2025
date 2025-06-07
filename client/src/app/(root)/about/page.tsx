import { Page, PageContainer, Title } from 'components'

/* ========================================================================

======================================================================== */

const About = async () => {
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
          About
        </Title>

        <article className='bg-background-light mx-auto mb-6 min-h-[200px] max-w-[800px] rounded-xl border p-4 leading-[2] shadow'>
          <p className=''>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius sequi
            dolore ut. Facere perferendis praesentium ipsum nisi qui, dolor
            consequuntur quisquam eligendi vero. Consectetur blanditiis nobis
            laudantium dolorem. Quae nostrum distinctio quam qui in. Aperiam
            dolor amet eius esse officiis eveniet unde provident, repellat
            debitis cupiditate aliquid corporis culpa! Voluptas natus vitae
            debitis, asperiores, tempore atque reiciendis illum eos, unde
            commodi eligendi excepturi adipisci? Doloremque, exercitationem
            quam. Ex debitis aut facilis voluptatum, esse quis maiores quo
            consequuntur atque officia veritatis cupiditate quia in magnam
            veniam facere eveniet dolorem eaque ut! Rerum quam beatae mollitia
            temporibus veniam. Impedit illum dignissimos minus.
          </p>

          {/* <pre className='bg-background text-primary mx-auto mb-6 max-w-9/10 rounded-lg border text-sm'>
            <code>{`
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: \`${'${EXPRESS_URL}'}/api/:path*\`
      }
    ]
  }
            `}</code>
          </pre> */}
        </article>
      </PageContainer>
    </Page>
  )
}

export default About
