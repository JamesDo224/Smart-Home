import styles from './loading.module.css';

const Loader = () => {
  return (
    <div aria-live="assertive" role="alert" className={styles.loader}>
      <div className={styles.loader__balls}>
        <div className={styles.loader__balls__group}>
          <div className={`${styles.ball} ${styles.item1}`} />
          <div className={`${styles.ball} ${styles.item1}`} />
          <div className={`${styles.ball} ${styles.item1}`} />
        </div>
        <div className={styles.loader__balls__group}>
          <div className={`${styles.ball} ${styles.item2}`} />
          <div className={`${styles.ball} ${styles.item2}`} />
          <div className={`${styles.ball} ${styles.item2}`} />
        </div>
        <div className={styles.loader__balls__group}>
          <div className={`${styles.ball} ${styles.item3}`} />
          <div className={`${styles.ball} ${styles.item3}`} />
          <div className={`${styles.ball} ${styles.item3}`} />
        </div>
      </div>
    </div>
  );
}

export default Loader;
