import * as React from 'react';
import styles from './HomePage.module.scss';
import { IHomePageProps } from './IHomePageProps';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
export default class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;
    const stackStyles: IStackStyles = {
      root: {
        background: DefaultPalette. white,
        margin:100
      },
    };
    // if need 
    // const getUrlFunction=()=>{
    //   window.location.href
    // }
    const disabledvalue = true

    return (
      <section >
        <Stack enableScopedSelectors styles={stackStyles}>
        <DefaultButton text='Create New Request' className={styles.homePageButton} href='http://www.baidu.com'/>
        <DefaultButton text='Request List' className={styles.homePageButton}/>
        <DefaultButton text='Goods Issue List' className={styles.homePageButton}/>
        <DefaultButton text='Create New Distribution Request' className={styles.homePageButton}/>
        <DefaultButton text='My Distribution Request' className={styles.homePageButton}/>
        <DefaultButton text='Received Distribution' className={styles.homePageButton}/>
        <DefaultButton text='Inventory Management' className={disabledvalue?styles.homePageButtonDisabled : styles.homePageButton} disabled={disabledvalue}/>
        </Stack>
      </section>
    );
  }
}
