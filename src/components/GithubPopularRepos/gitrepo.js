import { Component } from "react";
import * as Loader from "react-loader-spinner";

import LanguageFilterItem from "../LanguageFilterItem/language";
import RepositoryItem from "../RepositoryItem/repoitem";

import "./gitrepo.css";

const languageFiltersData = [
  { id: "ALL", language: "All" },
  { id: "JAVASCRIPT", language: "Javascript" },
  { id: "RUBY", language: "Ruby" },
  { id: "JAVA", language: "Java" },
  { id: "CSS", language: "CSS" },
];

const apiStatusConstants = {
  sucess: "SUCESS",
  failure: "FAILURE",
  loading: "IN PROGRESS",
  initial: "INITIAL",
};

class GithubPopularRepos extends Component {
  state = {
    activeId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
    repositoryData: [],
  };

  componentDidMount() {
    this.getRepos();
  }

  getRepos = async () => {
    console.log("called");
    // console.log('triggred')
    const { activeId } = this.state;
    this.setState({ apiStatus: apiStatusConstants.loading });
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeId}`;
    const response = await fetch(apiUrl);
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json();
      const updatedData = data.popular_repos.map((eachItem) => ({
        id: eachItem.id,
        name: eachItem.name,
        issuesCount: eachItem.issues_count,
        forksCount: eachItem.forks_count,
        starsCount: eachItem.stars_count,
        imageUrl: eachItem.avatar_url,
      }));
      this.setState({
        apiStatus: apiStatusConstants.sucess,
        repositoryData: updatedData,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  repositoriesListView = () => {
    const { repositoryData } = this.state;
    return (
      <ul className="repositories-list">
        {repositoryData.map((eachRepo) => (
          <RepositoryItem key={eachRepo.id} repositoryDetails={eachRepo} />
        ))}
      </ul>
    );
  };

  updateActiveId = (id) => {
    this.setState({ activeId: id }, this.getRepos);
  };

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  );

  loadingView = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  );

  languageFiltersList = () => {
    const { activeId } = this.state;

    return (
      <ul className="filters-list">
        {languageFiltersData.map((eachLanguage) => (
          <LanguageFilterItem
            key={eachLanguage.id}
            languageFilterDetails={eachLanguage}
            updateActiveId={this.updateActiveId}
            isActive={eachLanguage.id === activeId}
          />
        ))}
      </ul>
    );
  };

  rendersViews = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.sucess:
        return this.repositoriesListView();
      case apiStatusConstants.fail:
        return this.failureView();
      case apiStatusConstants.loading:
        return this.loadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          {this.languageFiltersList()}
          {this.rendersViews()}
        </div>
      </div>
    );
  }
}

export default GithubPopularRepos;
