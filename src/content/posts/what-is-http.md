---
title: "What Is HTTP?"
series: network-protocols
order: 2
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/computer-networks/network-protocols|Network Protocols]]
- 이전 글: [[dns-resolution|DNS and Name Resolution]]
- 다음 글: [[tls-and-https|TLS and HTTPS]]

HTTP is the application-layer protocol that lets a client ask for a resource and a server answer with a response. When you open a web page, load an API endpoint, or submit a form, the application usually speaks HTTP on top of lower-level protocols such as DNS, TCP, and sometimes TLS. HTTP does not move bytes across the network by itself; it defines the structure and meaning of the messages exchanged between two endpoints.

## What HTTP Is

HTTP stands for HyperText Transfer Protocol. It is a request/response protocol: one side sends a request that identifies a target resource and the action it wants to perform, and the other side sends a response that reports the result.

That model makes HTTP different from a generic socket protocol. A raw TCP connection only gives two programs a reliable byte stream. HTTP adds shared rules for things such as methods, headers, status codes, and message bodies so independent clients and servers can understand each other. That is why a browser, a mobile app, and a command-line tool can all talk to the same HTTP server.

In practice, HTTP is usually the protocol closest to the application logic. A browser does not ask the server "send me bytes somehow." It sends an HTTP request like `GET /articles/42` and expects an HTTP response that says whether the resource exists and what data should be returned.

## The Request and Response Model

An HTTP exchange begins with a client request. The request includes:

- a method such as `GET` or `POST`
- a target such as `/users/123`
- headers that carry metadata
- an optional body for data being sent to the server

The server reads that message, processes it, and returns a response with:

- a status code such as `200` or `404`
- response headers
- an optional response body

A minimal example looks like this:

```http
GET /hello HTTP/1.1
Host: example.com
Accept: text/plain
```

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 5

hello
```

The client is not naming a database table or a function call directly. It is making a standardized protocol message. The server can route that message to application code, read from a database, call another service, and then translate the result back into an HTTP response.

## Methods, Status Codes, and Headers

The method tells the server what kind of action the client wants. `GET` asks for a representation of a resource. `POST` usually submits new data for processing. `PUT` replaces a resource, and `DELETE` removes one.

Status codes summarize the outcome in a compact, standardized way:

- `2xx` means the request succeeded
- `3xx` means the client should look elsewhere
- `4xx` means the client sent something invalid or requested something unavailable
- `5xx` means the server failed while trying to handle a valid request

Headers carry the metadata that lets the two sides coordinate. `Content-Type` tells the receiver how to interpret the body. `Authorization` carries credentials. `Cache-Control` tells intermediaries and clients how to cache the result. Without headers, every application would need its own private message format and interoperability would collapse.

## Why HTTP Is Stateless

HTTP is called stateless because each request is defined to stand on its own. The protocol does not require the server to remember previous requests from the same client in order to understand the current one.

That does not mean web applications have no state. Shopping carts, logged-in sessions, and API tokens clearly exist. The point is that application state is layered on top of HTTP rather than built into the core protocol. A cookie, a bearer token, or a session identifier lets the application reconnect one request to earlier ones.

This separation is useful operationally. Stateless protocol messages are easier to route through proxies, easier to retry, and easier to distribute across multiple servers because any server that has access to the application state store can answer the request.

## Where HTTP Sits in the Web Stack

To fetch `https://example.com/articles/42`, the client moves through several layers:

1. Resolve the domain name with DNS.
2. Open a connection to the server, usually with TCP.
3. If the URL is HTTPS, negotiate encryption with TLS.
4. Send the HTTP request over that established channel.
5. Read the HTTP response and render or process the result.

This layering matters because HTTP and TCP solve different problems. TCP handles ordered, reliable byte delivery. HTTP defines the application meaning of the bytes. TLS adds confidentiality and integrity. Keeping those responsibilities separate is what lets the same HTTP semantics run over plain TCP, encrypted HTTPS, or newer transports in later protocol versions.

## Example: Loading One Web Page

Suppose you enter `https://example.com/docs/http` into a browser.

First, the browser asks DNS for the IP address of `example.com`. Next, it opens a TCP connection to that address. Because the URL is HTTPS, it then performs a TLS handshake so the traffic is encrypted and the server can prove its identity. Only after those lower layers are ready does the browser send an HTTP request such as:

```http
GET /docs/http HTTP/1.1
Host: example.com
Accept: text/html
User-Agent: browser-example
```

The server might respond:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=60

<html>...</html>
```

At that point, HTTP's role is clear. It tells the browser which resource was requested, whether the request succeeded, what type of data came back, and whether it can be cached. The lower layers were necessary to deliver the bytes safely, but HTTP is the layer that expresses the application's intent.

## Quiz

**Q1.** What problem does HTTP solve in the web stack?

- A) It guarantees reliable byte delivery between hosts
- B) It defines the structure and meaning of application-layer requests and responses
- C) It translates domain names into IP addresses
- D) It encrypts all traffic by default

<details>
<summary>Answer</summary>
B. HTTP defines how clients and servers express application actions and results. Reliable transport, name resolution, and encryption are handled by other layers.
</details>

---

**Q2.** What is the main difference between HTTP and TCP?

- A) HTTP is a transport protocol and TCP is an application protocol
- B) HTTP provides encryption and TCP provides caching
- C) TCP moves bytes reliably, while HTTP gives those bytes request/response semantics
- D) TCP is used only in browsers, while HTTP is used only in APIs

<details>
<summary>Answer</summary>
C. TCP is responsible for ordered, reliable delivery of bytes. HTTP sits above it and defines what those bytes mean to clients and servers.
</details>

---

**Q3.** Why is HTTP called stateless?

- A) Because HTTP servers are forbidden to store data anywhere
- B) Because each request can be understood without requiring protocol-level memory of earlier requests
- C) Because clients cannot send cookies or tokens
- D) Because HTTP responses never depend on user identity

<details>
<summary>Answer</summary>
B. Stateless means the protocol treats each request as self-contained. Applications can still layer sessions or tokens on top of it.
</details>

---

**Q4.** Which sequence best matches what usually happens when loading an HTTPS page?

- A) HTTP request → DNS lookup → TLS handshake → TCP connection
- B) DNS lookup → TCP connection → TLS handshake → HTTP request
- C) TCP connection → HTTP request → DNS lookup → TLS handshake
- D) TLS handshake → DNS lookup → HTTP request → TCP connection

<details>
<summary>Answer</summary>
B. The client must first find the server, then open the transport connection, then negotiate TLS for HTTPS, and only then send the HTTP request.
</details>

---

**Q5.** What is the role of an HTTP status code such as `404` or `200`?

- A) It identifies the server's IP address
- B) It tells the client the high-level outcome of the request
- C) It selects the TLS cipher suite
- D) It stores session state across requests

<details>
<summary>Answer</summary>
B. Status codes are the protocol's compact way to report whether the request succeeded, redirected, failed on the client side, or failed on the server side.
</details>
