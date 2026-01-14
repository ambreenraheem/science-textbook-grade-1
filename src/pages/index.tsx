import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/intro">
            Start Learning Now! 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Interactive science learning for Grade-1 students">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>🌱 5 Exciting Topics</h3>
                  <p>
                    Explore living things, animals, plants, your body, and the universe!
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>🎥 Educational Videos</h3>
                  <p>
                    Watch fun and safe videos carefully selected by teachers.
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>🤖 AI Helper</h3>
                  <p>
                    Ask questions anytime! Our friendly chatbot is here to help.
                  </p>
                </div>
              </div>
            </div>
            <div className="row" style={{marginTop: '2rem'}}>
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>✅ Take Quizzes</h3>
                  <p>
                    Test what you've learned with fun quizzes after each lesson!
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>📊 Track Progress</h3>
                  <p>
                    See how much you've learned and earn stars for completing lessons!
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4', styles.feature)}>
                <div className="text--center padding-horiz--md">
                  <h3>🌍 English & Urdu</h3>
                  <p>
                    Learn in the language you're most comfortable with!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
