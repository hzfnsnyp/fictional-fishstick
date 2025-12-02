<template>
  <main class="main-content flow main-content--flow-none privacy-page">
    <div class="layout-content">
      <h1 class="page-title">Privacy Policy</h1>
    </div>

    <section class="layout-main privacy-intro" style="--flow-space: var(--spacing-48)">
      <div class="layout-narrow privacy-intro__inner">
        <p class="privacy-lede">
          This draft outlines how Leah Sanata Studio ("the Studio") captures, stores, and uses personal information
          collected through our website, newsletters, and in-person programming. The final legal text will follow this
          structure.
        </p>
        <p class="privacy-meta">Last revised: {{ lastUpdated }}</p>

        <CollapsibleSection title="Contents" :default-expanded="false" variant="compact">
          <ul class="privacy-toc">
            <li v-for="section in tocSections" :key="section.anchor">
              <a :href="section.anchor">{{ section.title }}</a>
              <ul v-if="section.children" class="privacy-toc__children">
                <li v-for="child in section.children" :key="child.anchor">
                  <a :href="child.anchor">{{ child.title }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </CollapsibleSection>
      </div>
    </section>

    <section class="layout-main privacy-body">
      <div class="layout-narrow privacy-body__inner">
        <article id="privacy-1" class="privacy-article">
          <h2 class="privacy-article__title">1. Who we are</h2>
          <p class="privacy-article__lead">
            Leah Sanata Studio is operated from Dubai, United Arab Emirates. When this policy refers to "we", "us" or
            "the Studio", it means the studio and its small team handling digital communications and client services.
            You can reach us using the contact details in section 11.
          </p>
        </article>

        <article id="privacy-2" class="privacy-article">
          <h2 class="privacy-article__title">2. What is personal data?</h2>
          <p class="privacy-article__lead">
            Personal data is any information that can identify a living individual either directly or when combined with
            other information that we hold. This includes names, contact details, payment information and imagery such as
            event photography or CCTV footage from partner venues.
          </p>
        </article>

        <article id="privacy-3" class="privacy-article">
          <h2 class="privacy-article__title">3. What personal data we hold</h2>
          <p class="privacy-article__lead">
            The Studio only collects personal data that is relevant to your relationship with us. Below is an overview of
            the key categories.
          </p>
          <section id="privacy-3-supporters" class="privacy-subsection">
            <h3 class="privacy-subsection__title">Supporters &amp; collectors</h3>
            <p>
              When you acquire a work, make a donation, RSVP to private events, or purchase from the studio shop we may
              collect:
            </p>
            <ul class="privacy-list">
              <li>Contact details: name, postal address, email address, phone number, and preferred language.</li>
              <li>Payment information: bank details, credit or debit card tokens, and billing history.</li>
              <li>Preferences: notes on interests, past acquisitions, and events you have attended.</li>
            </ul>
            <p>
              If you attend an in-person gathering we may also request access needs, dietary preferences, or the names of
              guests accompanying you.
            </p>
          </section>

          <section id="privacy-3-newsletter" class="privacy-subsection">
            <h3 class="privacy-subsection__title">Newsletter and updates</h3>
            <p>
              When you opt in to studio updates we store your name, email address, language preference, and the topics you
              requested. You may unsubscribe at any time from the footer of any email or by contacting us directly.
            </p>
          </section>

          <section id="privacy-3-visits" class="privacy-subsection">
            <h3 class="privacy-subsection__title">Visits to our digital platforms</h3>
            <p>
              Our website automatically collects basic technical information, including IP address, browser type and
              version, time-zone setting, clickstream data, page response times, download errors, and session duration.
              This helps us diagnose faults and understand how visitors use the site.
            </p>
          </section>

          <section id="privacy-3-cookies" class="privacy-subsection">
            <h3 class="privacy-subsection__title">Cookies and analytics</h3>
            <p>
              Cookies distinguish you from other visitors and support essential functionality. A detailed cookie schedule
              will accompany the final policy; for now we only use strictly necessary analytics supplied by
              privacy-focused providers.
            </p>
          </section>

          <section id="privacy-3-other" class="privacy-subsection">
            <h3 class="privacy-subsection__title">Information from other sources</h3>
            <p>
              We occasionally receive data from partner institutions or event hosts—such as guest lists, access
              requirements, or RSVP confirmations. We may also enrich our records with publicly available information to
              understand our audience and manage fundraising efforts. Any such processing is assessed against this policy
              and applicable law.
            </p>
          </section>
        </article>

        <article id="privacy-4" class="privacy-article">
          <h2 class="privacy-article__title">4. Purposes for which personal data is used</h2>
          <p class="privacy-article__lead">We process personal data to:</p>
          <ul class="privacy-list">
            <li>Respond to enquiries and provide information about artworks, commissions, or programming.</li>
            <li>Administer purchases, donations, and exhibition RSVPs, including issuing invoices and Gift Aid claims.</li>
            <li>Deliver newsletters and personalised updates that you have requested.</li>
            <li>Manage events, including guest coordination and on-site logistics.</li>
            <li>Improve our website experience and security.</li>
            <li>Maintain legal and accounting records.</li>
          </ul>
        </article>

        <article id="privacy-5" class="privacy-article">
          <h2 class="privacy-article__title">5. Legitimate interests for processing</h2>
          <p class="privacy-article__lead">
            The General Data Protection Regulation allows us to process personal data when it is necessary for our
            legitimate interests, provided those interests are not overridden by your rights. This covers supporter care,
            customer service, claiming Gift Aid, protecting our website, and tailoring communications to make them
            relevant.
          </p>
        </article>

        <article id="privacy-6" class="privacy-article">
          <h2 class="privacy-article__title">6. Sharing personal data with third parties</h2>
          <p class="privacy-article__lead">
            We never sell personal data. We do share information with trusted vendors who provide payment processing,
            shipping, event logistics, CRM, analytics, and marketing services on our behalf. Any supplier handling personal
            data must meet our security standards and comply with GDPR where applicable. Some providers operate outside the
            EEA; in those cases we implement appropriate safeguards.
          </p>
        </article>

        <article id="privacy-7" class="privacy-article">
          <h2 class="privacy-article__title">7. Retention</h2>
          <p class="privacy-article__lead">
            We retain personal data only for as long as necessary to fulfil the purposes described in this policy, to
            comply with legal obligations, or to resolve disputes. Retention periods differ depending on the information
            category—for example, transaction records are stored for accounting requirements, whereas mailing preferences
            are deleted once you unsubscribe.
          </p>
        </article>

        <article id="privacy-8" class="privacy-article">
          <h2 class="privacy-article__title">8. Your rights</h2>
          <p class="privacy-article__lead">You may contact us to:</p>
          <ul class="privacy-list">
            <li>Request access to the personal data we hold.</li>
            <li>Correct inaccuracies or update your preferences.</li>
            <li>Withdraw consent to marketing communications.</li>
            <li>Request deletion of your personal data where legally permitted.</li>
          </ul>
        </article>

        <article id="privacy-9" class="privacy-article">
          <h2 class="privacy-article__title">9. Keeping your data secure</h2>
          <p class="privacy-article__lead">
            We implement technical and organisational measures to protect your data, including encrypted storage, access
            controls, secure payment gateways, and staff training. However, the transmission of information over the
            internet is not completely secure.
          </p>
        </article>

        <article id="privacy-10" class="privacy-article">
          <h2 class="privacy-article__title">10. Photography and documentation</h2>
          <p class="privacy-article__lead">
            Events organised by the Studio may be photographed or filmed for documentation and archival purposes. Consent
            is requested where required, and you can inform us if you prefer not to be captured.
          </p>
        </article>

        <article id="privacy-11" class="privacy-article">
          <h2 class="privacy-article__title">11. Contact us</h2>
          <p class="privacy-article__lead">
            You can contact the Studio at privacy@leahsanata.com or by post at the studio address in Dubai. We will
            respond to privacy-related requests within the timeframes required by applicable law.
          </p>
        </article>

        <article id="privacy-12" class="privacy-article">
          <h2 class="privacy-article__title">12. Changes to this policy</h2>
          <p class="privacy-article__lead">
            We may update this policy to reflect legal requirements or operational changes. The revision date will be
            updated above, and significant updates will be announced via our newsletter.
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import CollapsibleSection from '@/components/ui/CollapsibleSection.vue'

const tocSections = [
  { title: '1. Who we are', anchor: '#privacy-1' },
  { title: '2. What is personal data?', anchor: '#privacy-2' },
  {
    title: '3. What personal data we hold',
    anchor: '#privacy-3',
    children: [
      { title: 'Supporters & collectors', anchor: '#privacy-3-supporters' },
      { title: 'Newsletter and updates', anchor: '#privacy-3-newsletter' },
      { title: 'Visits to our digital platforms', anchor: '#privacy-3-visits' },
      { title: 'Cookies and analytics', anchor: '#privacy-3-cookies' },
      { title: 'Information from other sources', anchor: '#privacy-3-other' }
    ]
  },
  { title: '4. Purposes for which personal data is used', anchor: '#privacy-4' },
  { title: '5. Legitimate interests for processing', anchor: '#privacy-5' },
  { title: '6. Sharing personal data with third parties', anchor: '#privacy-6' },
  { title: '7. Retention', anchor: '#privacy-7' },
  { title: '8. Your rights', anchor: '#privacy-8' },
  { title: '9. Keeping your data secure', anchor: '#privacy-9' },
  { title: '10. Photography and documentation', anchor: '#privacy-10' },
  { title: '11. Contact us', anchor: '#privacy-11' },
  { title: '12. Changes to this policy', anchor: '#privacy-12' }
]

export default {
  name: 'PrivacyPolicyView',
  components: { CollapsibleSection },
  data() {
    return {
      tocSections,
      lastUpdated: 'May 2026'
    }
  }
}
</script>

<style scoped>
.privacy-page {
  padding-bottom: var(--spacing-96);
}

.privacy-intro {
  padding-block: var(--spacing-48);
}

.privacy-intro__inner {
  display: grid;
  gap: var(--spacing-32);
}

.privacy-lede {
  margin: 0;
}

.privacy-meta {
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

.privacy-toc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--spacing-16);
}

.privacy-toc a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-normal);
}

@media (hover: hover) and (pointer: fine) {
  .privacy-toc a:hover {
    color: var(--color-brand-primary);
  }
}

.privacy-toc a:focus-visible {
  color: var(--color-brand-primary);
}

.privacy-toc__children {
  list-style: none;
  margin: var(--spacing-12) 0 0 var(--spacing-20);
  padding: 0;
  display: grid;
  gap: var(--spacing-12);
}

.privacy-body {
  padding-block: var(--spacing-48);
}

.privacy-body__inner {
  display: grid;
  gap: var(--spacing-48);
}

.privacy-article {
  display: grid;
  gap: var(--spacing-12);
}

.privacy-article__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-light);
  color: var(--color-text-secondary);
}

.privacy-article__lead {
  margin: 0;
}

.privacy-subsection {
  display: grid;
  gap: var(--spacing-12);
  margin: 0;
}

.privacy-subsection + .privacy-subsection {
  margin-top: var(--spacing-12);
}

.privacy-subsection__title {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--font-weight-light);
  font-size: var(--font-size-24);
  color: var(--color-text-primary);
}

.privacy-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.privacy-list li {
  position: relative;
  padding-left: var(--spacing-48);
  color: var(--color-text-secondary);
}

.privacy-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  width: 12px;
  height: 1px;
  background: var(--color-border-subtle);
}

@media (max-width: 768px) {
  .privacy-intro {
    padding-block: var(--spacing-32);
  }

  .privacy-body {
    padding-block: var(--spacing-32);
  }
}
</style>


